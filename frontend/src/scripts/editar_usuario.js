document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const form = document.getElementById('form-editar-usuario');

    // Cargar datos del usuario
    fetch(`http://localhost:3000/api/usuarios/${id}`)
        .then(res => res.json())
        .then(data => {
            const usuario = data.usuario;
            form.nombre.value = usuario.nombre;
            form.mail.value = usuario.mail;
            form.ubicacion.value = usuario.ubicacion;
        })
        .catch(err => {
            console.error("Error cargando usuario:", err);
            alert("No se pudo cargar la información del usuario");
        });

    // Guardar cambios
// Guardar cambios
    form.addEventListener('submit', e => {
        e.preventDefault();

        const id = new URLSearchParams(window.location.search).get('id');
        const formData = new FormData(form); // Incluye todos los campos + archivo

        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            body: formData // NO usamos JSON.stringify
        })
        .then(async res => {
            if (!res.ok) {
                const error = await res.json();
                if (res.status === 409) {
                    throw new Error("El mail ya está registrado por otro usuario");
                } else {
                    throw new Error(error.error || "Error al actualizar el usuario");
                }
            }
            return res.json();
        })
        .then(() => {
            alert("Usuario actualizado correctamente");
            window.location.href = `usuario.html?id=${id}`;
        })
        .catch(err => {
            console.error("Error actualizando usuario:", err);
            alert(err.message);
        });
    });


});
