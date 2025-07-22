document.getElementById('registro-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = document.querySelector('.btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    const formData = new FormData();

    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('mail', document.getElementById('email').value);
    formData.append('clave', document.getElementById('password').value);
    formData.append('ubicacion', document.getElementById('ubicacion').value);

    const imagenInput = document.getElementById('imagen');
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            body: formData
            // No pongas Content-Type: multipart/form-data, fetch lo hace automáticamente con FormData
        });

        const data = await response.json();

        if (response.ok) {
            alert('¡Registro exitoso!');
            window.location.replace('/index.html');
        } else {
            alert('Error al registrar: ' + (data.error || data.message));
        }

    } catch (error) {
        console.error('Error al conectarse con la API:', error);
        alert('Ocurrió un error al registrar el usuario.');
    }
    finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Registrarme';
    }
});
document.getElementById('btn-cerrar').addEventListener('click', () => {
        window.location.href = 'index.html';
});
