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
    form.addEventListener('submit', e => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const mail = document.getElementById('mail').value.trim();
        const clave = document.getElementById('clave').value;
        const ubicacion = document.getElementById('ubicacion').value.trim();

        if (nombre.length > 50) {
            alert('El nombre no puede superar los 50 caracteres.');
            submitButton.disabled = false;
            submitButton.textContent = 'Registrarme';
            return;
        }
        else if (mail.length > 50) {
            alert('El mail no puede superar los 50 caracteres.');
            submitButton.disabled = false;
            submitButton.textContent = 'Registrarme';
            return;
        }
        else if (clave.length > 16) {
            alert('La contraseña no puede superar los 16 caracteres.');
            submitButton.disabled = false;
            submitButton.textContent = 'Registrarme';
            return;
        }
        else if (ubicacion.length > 50) {
            alert('La ubicación no puede superar los 50 caracteres.');
            submitButton.disabled = false;
            submitButton.textContent = 'Registrarme';
            return;
        }

        const id = new URLSearchParams(window.location.search).get('id');
        const formData = new FormData(form); // Incluye todos los campos + archivo

        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            body: formData
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
