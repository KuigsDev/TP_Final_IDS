function abrirVentana() {
    fetch('ventana_agregar.html')
    .then(response => response.text())
    .then(html => {
    document.getElementById('contenido').innerHTML = html;
    document.getElementById('ventana').style.display = 'flex';
});
}



function cerrarVentana() {
    document.getElementById('ventana').style.display = 'none';
document.getElementById('contenido').innerHTML = '';
    }

function abrirVentanaEditar() {
    fetch('ventana_editar.html')
    .then(response => response.text())
    .then(html => {
    document.getElementById('contenido').innerHTML = html;
    document.getElementById('ventana').style.display = 'flex';
});
}



function cerrarVentanaEditar() {
    document.getElementById('ventana').style.display = 'none';
document.getElementById('contenido').innerHTML = '';
    }

