document.getElementById('registro-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = document.querySelector('.btn');
    submitButton.disabled = true;
    submitButton.textContent = 'Registrando...';

    const nombre = document.getElementById('nombre').value.trim();
    const mail = document.getElementById('email').value.trim();
    const clave = document.getElementById('password').value;
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const imagenInput = document.getElementById('imagen');
    

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
    else if (imagenInput.files.length === 0) {
    alert('Debes seleccionar una imagen para registrarte.');
    submitButton.disabled = false;
    submitButton.textContent = 'Registrarme';
    return;
    }

    const formData = new FormData();

    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('mail', document.getElementById('email').value);
    formData.append('clave', document.getElementById('password').value);
    formData.append('ubicacion', document.getElementById('ubicacion').value);
    formData.append('imagen', document.getElementById('imagen').files[0]);

    try {
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert('¡Registro exitoso!');
            window.location.replace('/usuarios.html');
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
        window.location.href = 'usuarios.html';
    });
