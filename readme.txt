Bueno, mi idea es la siguiente, será una página para hacer una lista de productos, hacer calculos de los mismos precios y asi saber cuanto sera el monto a pagar. Si se actualiza o refresca no se pierde el resultado, a menos de que se presione un botón que diga: Iniciar un nuevo cálculo de productos.

Se basaría en un archivo JSON, te lo paso y te explico porqué y que significa cada valor, te parece bien?

Se llama productos.json y aquí está el contenido:

{
    "id": 1,
    "tipo": "Botellin",
    "contenido": "200 ML",
    "nombre": "ALOE BETA PIÑA",
    "descuentos": {
        "20%": "36.89",
        "25%": "34.87",
        "30%": "32.84",
        "35%": "30.81",
        "40%": "28.78"
    },
    "precioPublico": "45.00",
    "precioUnidad": "45.00",
    "imagen": "aloe.png"
}



{
    "id": 1, <- Este sera un ID unico, habra maximo 51 o 52
    "tipo": "Botellin", <- Aqui el tipo de producto, Botellin, Caja, Botella, Lata, Frasco o DoyPack
    "contenido": "200 ML", <- Contenido que habra, # Sobres, ML, LT, GR
    "nombre": "ALOE BETA PIÑA", <- Nombre del Producto
    "descuentos": { <- Aqui empiezan los descuentos
        "20%": "36.89", <- el 20% de Descuento del Precio
        "25%": "34.87", <- el 25% de Descuento del Precio
        "30%": "32.84", <- el 30% de Descuento del Precio
        "35%": "30.81", <- el 35% de Descuento del Precio
        "40%": "28.78"  <- el 40% de Descuento del Precio
    },
    "precioPublico": "45.00", <- El Precio sin descuento alguno
    "precioUnidad": "45.00", <- El Precio por unidad, Sobre/Sobres, Botellin, Lata
    "imagen": "aloe.png" <- La imagen del producto.
}


Esta es mi idea, me gustaría saber que piensas y que consideras que se puede mejorar o evitar, tus ideas y sugerencias son más que bienvenidas.

tengo una carpeta llamada: imagenes/ donde estan las imagenes de cada producto, el nombre del archivo y su extension estan en el productos.json como "imagen":

Bueno, aqui voy:

- Usar Bootstrap, FontAwesome, HTML y Javascript para el diseño y función de la página, pienso alojarla en GitHub Pages pero por ahora la estare ejecutando en XAMPP.

- En la parte superior de la página estará una alerta con el texto: Aún no hay productos seleccionados para calcular. Cuando se añadan productos entonces cambiará a Precio actual de tus productos seleccionados: $ Dónde aparecerá el costo de los productos que hayan sido seleccionados.

- en la parte superior abajo de la alerta, habra una columna dividida en dos columnas, en una el buscador en tiempo real para que sea intuitivo buscar un producto (mediante el nombre del producto), un botón que diga "Iniciar una nueva lista de productos". 

- Abajo del buscador y boton, el sitio mostrará la lista de productos en una forma de cuadrículas con cards de Bootstrap. Estara la imagen del producto, abajo de la imagen el nombre del producto y el Precio Publico.

- Se mostrarán en forma de paginación con máximo de 12 artículos por página para que no sea tan llena de elementos.

- al dar clic sobre la imagen del producto que aparezca una ventana modal, con lo siguiente:

Nombre del Producto: (tomado de "nombre" en el productos.json) <- En el titulo de la ventana modal

En el contenido de la modal:
Caja ((tomado de "tipo" en el productos.json)) - 30 Sobres ((tomado de "contenido" en el productos.json)). Tipo: (tomado de "tipo" en el productos.json)  y Contenido  (tomado de "contenido" en el productos.json).

abajo en la proxima linea, un selector numerico para elegir cuantos productos/unidades se quieren añadir, seria un minimo de uno y maximo 50.

si se selecciona un producto que sea Caja, que tenga "tipo" caja, entonces que aparezca la opcion de
Por Sobre [Checkbox para tildar] Por Caja [Checkbox para tildar]

Si se marca una entonces la otra ya no se puede ehecar a menos que se desmarque la otra.

Pero si es botellin, botella, lata, frasco o Doypack entonces que aparezca solo el selector numerico.

abajo en la proxima linea, un Dropdown con los descuentos disponibles en productos.json: 20% [Costo que aparece en cada descuento del productos.json], 25% [Costo que aparece en cada descuento del productos.json], 30% [Costo que aparece en cada descuento del productos.json], 35% [Costo que aparece en cada descuento del productos.json], 40% [Costo que aparece en cada descuento del productos.json] o Precio Publico.

- En la alerta me gustaria que una vez añadidos productos, muestre la cantidad, el nombre del producto, el tipo de producto y el costo/descuento que se haya seleccionado (me gustaría que pudiera aparecer si es singular o plural que aparezca caja o cajas, sobre o sobres, lata o latas, y así sucesivamente). Abajo de eso que aparezca Costo Total.