document.addEventListener("DOMContentLoaded", () => {
    let productos = [];
    let productosSeleccionados = [];

    // Cargar los productos desde el archivo JSON
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data;
            mostrarProductos(productos);
        });

    function mostrarProductos(productos) {
        const contenedorProductos = document.getElementById('productos');
        contenedorProductos.innerHTML = '';

        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'col-md-4';
            card.innerHTML = `
                <div class="card border-warning">
                    <img class="rounded mx-auto d-block card-img-top" src="imagenes/${producto.imagen}" alt="${producto.nombre}">
                    <div class="card-body">
                        <h4 class="card-title">${producto.nombre}</h4>
                        <h3>
                        ${producto.tipo}
                        <small class="text-muted">
                        ${producto.contenido}
                        </small>
                        </h3>
                        <h5>
                        <span class="badge badge-pill badge-info">
                        Precio al Publico $${producto.precioPublico}
                        </span>
                        </h5>
                        <button class="btn btn-primary" id="btnSeleccionar-${producto.id}">Seleccionar</button>
                    </div>
                </div>
            `;
            contenedorProductos.appendChild(card);

            // Añadir el evento al botón
            document.getElementById(`btnSeleccionar-${producto.id}`).addEventListener('click', () => abrirModal(producto.id));
        });
    }

    // Aquí agregas la nueva función de filtro
    function filtrarProductos() {
        const filtro = document.getElementById('buscador').value.toLowerCase();
        const productosFiltrados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(filtro)
        );
        mostrarProductos(productosFiltrados);
    }

    // Evento de buscador
    document.getElementById('buscador').addEventListener('input', filtrarProductos);

    // Función abrirModal y otras funciones ya existentes...
    window.abrirModal = function(id) {
        const producto = productos.find(p => p.id === id);
        if (!producto) {
            console.error("Producto no encontrado");
            return;
        }

        document.getElementById('modalLabel').innerText = producto.nombre;
        document.getElementById('modalLabel').dataset.productId = producto.id;
        document.getElementById('detalleProducto').innerText = `${producto.tipo} - ${producto.contenido}`;

        const descuentosDropdown = document.getElementById('descuentos');
        descuentosDropdown.innerHTML = ''; 

        const precioPublicoOption = document.createElement('option');
        precioPublicoOption.value = producto.precioPublico; 
        precioPublicoOption.innerText = `Precio Público - $${producto.precioPublico}`;
        descuentosDropdown.appendChild(precioPublicoOption);
        
        const precioUnidadOption = document.createElement('option');
        precioUnidadOption.value = producto.precioUnidad; 
        precioUnidadOption.innerText = `Precio Unidad - $${producto.precioUnidad}`;
        descuentosDropdown.appendChild(precioUnidadOption);
        
        Object.entries(producto.descuentos).forEach(([descuento, precio]) => {
            const option = document.createElement('option');
            option.value = precio; 
            option.innerText = `${descuento} - $${precio}`;
            descuentosDropdown.appendChild(option);
        });

        limpiarDatosModal();

        const opcionesCaja = document.getElementById('opcionesCaja');
        if (producto.tipo === "Caja") {
            opcionesCaja.style.display = 'block';

            document.querySelectorAll('input[name="tipoCaja"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === "Sobre") {
                        descuentosDropdown.value = producto.precioUnidad; 
                        descuentosDropdown.disabled = true; 
                    } else {
                        descuentosDropdown.disabled = false; 
                    }
                    actualizarTotal(); 
                });
            });
        } else {
            opcionesCaja.style.display = 'none';
        }

        descuentosDropdown.addEventListener('change', actualizarTotal);
        document.getElementById('cantidad').addEventListener('input', actualizarTotal);
        
        $('#modalProducto').modal('show');
    }

    function limpiarDatosModal() {
        const descuentosDropdown = document.getElementById('descuentos');
        descuentosDropdown.value = '';
        descuentosDropdown.disabled = false; 

        document.getElementById('cantidadTotal').innerText = `$0.00 (Cantidad: 0)`;
        document.getElementById('cantidad').value = 1; 
    }

    function actualizarTotal() {
        const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
        const descuentosDropdown = document.getElementById('descuentos');
        const precioSeleccionado = parseFloat(descuentosDropdown.value) || 0; 
        
        const total = precioSeleccionado * cantidad; 
        document.getElementById('cantidadTotal').innerText = `$${total.toFixed(2)} (Cantidad: ${cantidad})`; 
    }

    document.getElementById('btnAgregarProducto').addEventListener('click', () => {
        const cantidad = document.getElementById('cantidad').value;
        const modalLabel = document.getElementById('modalLabel');
        const productoId = parseInt(modalLabel.dataset.productId); 
        const producto = productos.find(p => p.id === productoId);
    
        if (!producto) {
            console.error("Producto no encontrado");
            return;
        }
    
        // Validaciones
        const descuentosDropdown = document.getElementById('descuentos');
        const descuentoSeleccionado = descuentosDropdown.value;
    
        let tipoSeleccionado = '';
        if (producto.tipo === "Caja") {
            const tipoSeleccionadoElement = document.querySelector('input[name="tipoCaja"]:checked');
            tipoSeleccionado = tipoSeleccionadoElement ? tipoSeleccionadoElement.value : '';
        }
    
        // Comprobar si se debe validar
        if (["Botella", "Lata", "Frasco", "Doypack", "Botellin"].includes(producto.tipo)) {
            if (!descuentoSeleccionado) {
                alert("Por favor, selecciona un descuento.");
                return; // Detener la ejecución si no se seleccionó un descuento
            }
        } else if (producto.tipo === "Caja") {
            if (!tipoSeleccionado) {
                alert("Por favor, selecciona un tipo: Por Sobre o Por Caja.");
                return; // Detener la ejecución si no se seleccionó un tipo
            }
            if (!descuentoSeleccionado) {
                alert("Por favor, selecciona un descuento.");
                return; // Detener la ejecución si no se seleccionó un descuento
            }
        }
    
        const productoSeleccionado = {
            nombre: producto.nombre,
            cantidad: parseInt(cantidad),
            tipo: tipoSeleccionado,
            precio: parseFloat(descuentoSeleccionado) * parseInt(cantidad)
        };
    
        productosSeleccionados.push(productoSeleccionado);
        actualizarAlerta();
        $('#modalProducto').modal('hide');
    });
    

    function actualizarAlerta() {
        const alerta = document.getElementById('alerta');
        const resultado = document.getElementById('resultado');
        const detallesProductos = document.getElementById('detallesProductos');
        const precioTotal = document.getElementById('precioTotal');
    
        if (!precioTotal || !detallesProductos) {
            console.error('Algunos elementos no se encontraron en el DOM.');
            return;
        }
    
        if (productosSeleccionados.length > 0) {
            alerta.style.display = 'none';
            resultado.style.display = 'block';
    
            let detalles = '';
            let total = 0;
    
            productosSeleccionados.forEach(producto => {
                detalles += `${producto.cantidad} ${producto.tipo || ''} de ${producto.nombre} - $${producto.precio.toFixed(2)}<br>`;
                total += producto.precio;
            });
    
            detallesProductos.innerHTML = detalles;
            precioTotal.innerText = `$${total.toFixed(2)}`;
        } else {
            alerta.style.display = 'block';
            resultado.style.display = 'none';
        }
    }
            
    document.getElementById('btnNuevaLista').addEventListener('click', () => {
        productosSeleccionados = [];
        actualizarAlerta();
    });
});
