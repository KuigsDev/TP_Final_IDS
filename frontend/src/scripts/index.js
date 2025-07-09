// src/js/index.js
document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("mis-productos");

    try {
        const res = await fetch("http://localhost:3000/api/objetos/recientes");
        const productos = await res.json();

        productos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");

            div.innerHTML = `
                <img class="producto__imagen" src="http://localhost:3000${producto.imagen}" alt="${producto.nombre}">
                <h4 class="producto__nombre">${producto.nombre}</h4>
                <p class="producto__descripcion">${producto.descripcion}</p>
                <p class="producto__categoria"><strong>Categoría:</strong> ${producto.categoria}</p>
                <p class="producto__estado"><strong>Estado:</strong> ${producto.estado}</p>
                <p class="producto__fecha"><strong>Publicado el:</strong> ${formatearFecha(producto.fecha_publicacion)}</p>
                <p class="producto__duenio">
                    <strong>Dueño:</strong> 
                    <a href="usuario.html?id=${producto.usuario_id}">${producto.duenio}</a>
                </p>
            `;

            contenedor.appendChild(div);
        });

    } catch (err) {
        console.error("Error al cargar productos recientes:", err);
        contenedor.innerHTML = `<p>Error al cargar productos recientes.</p>`;
    }
});

// Utilidad para formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
        year: "numeric", month: "long", day: "numeric"
    });
}
