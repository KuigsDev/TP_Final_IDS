document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("listado-usuarios");
    try {
        const res = await fetch("http://localhost:3000/api/usuarios");
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const usuarios = await res.json();

        usuarios.forEach(({id, nombre, mail, ubicacion, reputacion, imagen}) => {
            const div = document.createElement("div");
            div.classList.add("usuario__card");
            div.innerHTML = `
                <img class="usuario__imagen" src="http://localhost:3000${imagen}" alt="Foto de ${nombre}">
                <h3 class="usuario__nombre">${nombre}</h3>
                <p class="usuario__info"><strong>Email:</strong> ${mail}</p>
                <p class="usuario__info"><strong>Ubicación:</strong> ${ubicacion}</p>
                <p class="usuario__info"><strong>Reputación:</strong> ${textoReputacion(reputacion)}</p>
                <a href="usuario.html?id=${id}" class="usuario__perfil-link">Ver perfil</a>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = "<p>Error al cargar los usuarios.</p>";
    }

    function textoReputacion(valor) {
        switch(valor) {
            case 1: return "Muy mala";
            case 2: return "Mala";
            case 3: return "Normal";
            case 4: return "Buena";
            case 5: return "Muy buena";
            default: return "Desconocida";
        }
}
});

document.getElementById('registrar_usuario').addEventListener('click', () => {
    window.location.href = 'registro.html';
});
