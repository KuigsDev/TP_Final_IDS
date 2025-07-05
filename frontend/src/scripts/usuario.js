document.addEventListener("DOMContentLoaded", () => {
    cargarDatosUsuario(10); // ID hardcodeado por ahora
});

function cargarDatosUsuario(id) {
    fetch(`http://localhost:3000/api/usuarios/${id}`)
        .then(response => response.json())
        .then(data => {
                mostrarUsuario(data.usuario);
                mostrarProductos(data.productosPropios); // SOLO los productos del usuario
                mostrarTrueques(data.trueques, data.productosTrueques,data.usuario.id   ); // trueques con productos (aunque no sean del usuario)
        })
        .catch(error => console.error("Error cargando datos del usuario:", error));
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return fecha.toLocaleDateString('es-AR', opciones); // Ej: 01/06/2025
}

function mostrarUsuario(usuario) {
    document.querySelector('#usuario-info').innerHTML = `
        <img class="usuario__imagen" src="${usuario.imagen}" alt="usuario">
        <div class="usuario__informacion">
            <p><span class="usuario__informacion--bold">Nombre:</span> ${usuario.nombre}</p>
            <p><span class="usuario__informacion--bold">Mail:</span> ${usuario.mail}</p>
            <p><span class="usuario__informacion--bold">Reputacion:</span> ${usuario.reputacion}</p>
            <p><span class="usuario__informacion--bold">Ubicacion:</span> ${usuario.ubicacion}</p>
        </div>
    `;
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('mis-productos');
    contenedor.innerHTML = ''; // Limpiar antes de insertar

    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <div class="producto__acciones">
                <svg class="producto__icono eliminar" data-id="${producto.id}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 7h12M9 7v10m6-10v10M4 7h16M10 3h4a1 1 0 0 1 1 1v1H9V4a1 1 0 0 1 1-1zM5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12"/>
                </svg>
                <svg class="producto__icono editar" data-id="${producto.id}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 0 1 2.828 0l1.172 1.172a2 2 0 0 1 0 2.828L13 17H9v-4z"/>
                </svg>
            </div>
            <img class="producto__imagen" src="${producto.imagen}" alt="${producto.nombre}">
            <h4 class="producto__nombre">${producto.nombre}</h4>
            <p class="producto__descripcion">${producto.descripcion}</p>
            <p class="producto__categoria"><strong>Categoría:</strong> ${producto.categoria}</p>
            <p class="producto__estado"><strong>Estado:</strong> ${producto.estado}</p>
            <p class="producto__fecha"><strong>Publicado el:</strong> ${formatearFecha(producto.fecha_publicacion)}</p>
        `;
        contenedor.appendChild(div);
    });
}


function mostrarTrueques(trueques, productos,usuarioActualId) {
    const contenedor = document.getElementById('mis-trueques');
    contenedor.innerHTML = '';

    // Mapeamos los productos por ID para encontrar nombres fácilmente
    const productoPorId = {};
    productos.forEach(p => {
        productoPorId[p.id] = p;
    });

    trueques.forEach(trueque => {
        const productoOfrecido = productoPorId[trueque.producto_ofrecido_id];
        const productoDeseado = productoPorId[trueque.producto_deseado_id];

        const nombreOfrecido = productoOfrecido ? productoOfrecido.nombre : 'Producto desconocido';
        const nombreDeseado = productoDeseado ? productoDeseado.nombre : 'Producto desconocido';

        const div = document.createElement('div');
        div.classList.add('trueque');
        div.innerHTML = `
            <h4 class="trueque__texto no-margin">Cambio:</h4>
            <p class="trueque__nombre">${nombreOfrecido}</p>
            <h4 class="trueque__texto no-margin">Por:</h4>
            <p class="trueque__nombre">${nombreDeseado}</p>
            <p><strong>Solicitante:</strong> ${trueque.nombre_solicitante}</p>
            <p><strong>Fecha propuesta:</strong> ${formatearFecha(trueque.fecha)}</p>
            <p><strong>Estado:</strong> ${trueque.estado}</p>

            <div class="trueque__acciones">
                ${
                    trueque.usuario_solicitante_id === usuarioActualId
                    ? '' // Si soy solicitante, no muestro botones
                    : `
                    <button class="btn aceptar">Aceptar</button>
                    <button class="btn rechazar">Rechazar</button>
                    `
                }
            </div>
        `;
        contenedor.appendChild(div);
    });
}
