function abrirVentana() {
    fetch('ventana_agregar.html')
    .then(response => response.text())
    .then(html => {
    document.getElementById('contenido').innerHTML = html;
    document.getElementById('ventana').style.display = 'flex';

    
    const usuarioId = 6; //Id  del usuario Hardcodeado por el momento
    const botonConfirmar = document.querySelector(".boton-confirmar")
    const Inputcategoria = document.getElementById("categoriaSelect")
    const Inputnombre = document.getElementById("nombre-producto")
    const Inputestado = document.getElementById("estadoSelect")
    const Inputimagen = document.getElementById("imagen-producto")
    const Inputdescripcion = document.getElementById("descripcion-producto")

    botonConfirmar.addEventListener("click", async (e)=>{
        const nombre = Inputnombre.value.trim(); // Funcion trim quita espacios en blancos en los costados
        const descripcion = Inputdescripcion.value.trim(); 
        const categoria = Inputcategoria.value;
        const estado = Inputestado.value;
        const fecha_publicacion = new Date().toISOString().split("T")[0];
        // Para el tema de añadir imagenes lo dejo hardcodeado por el momento
        const imagen = "#";

        if (!nombre || !descripcion || !categoria || !estado || !imagen){
            alert("Por favor complete todo los campos");
            return;
        }
        else if (nombre.length > 55){ 
            alert("El nombre es muy largo");  //Compruebo que no supere el varchar de mi DB
            return;
        } 
        else if (descripcion.length > 255){
            alert("La descripcion es muy larga")
            return;
        }
        // Construyo el json del objeto nuevo
        const nuevoObjeto = {
            nombre,
            descripcion,
            categoria,
            estado,
            fecha_publicacion,
            imagen
        };
        try{
            const res = await fetch (`http://localhost:3000/api/objetos/${usuarioId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoObjeto)});

        const data = await res.json();  //Respuesta de la api al intentar hacer el POST
        
        if (!res.ok){ //Devuelve TRUE si el estado esta entre 200 y 299 y devuelve FALSE si el es 400,404 o 500
            throw new Error(data.error || "Error al publicar el objeto");
        }
        alert("Objeto publicado correctamente");
        cerrarVentana()
        } 
        catch(err){ //Capturamos el error que entedemos viene del BACKEND
            console.error("Ocurrio un error al momento de publicar el objeto",err);
            alert("No se pudo publicar el objeto")
        }
    })
})
}

function cerrarVentana() {
    document.getElementById('ventana').style.display = 'none';
    document.getElementById('contenido').innerHTML = '';
    }

function abrirVentanaEditar() {
    fetch('ventana_agregar.html')
    .then(response => response.text())
    .then(async html => {
    document.getElementById('contenido').innerHTML = html;
    document.getElementById('ventana').style.display = 'flex';

    const IdObjeto = 24; // ID del objeto a editar (hardcodeado por ahora)
    const Inputcategoria = document.getElementById("categoriaSelect");
    const Inputnombre = document.getElementById("nombre-producto");
    const Inputestado = document.getElementById("estadoSelect");
    const Inputimagen = document.getElementById("imagen-producto");
    const Inputdescripcion = document.getElementById("descripcion-producto");
    const botonConfirmar = document.querySelector(".boton-confirmar");

    // Traer datos actuales del objeto
    try {
        const res = await fetch(`http://localhost:3000/api/objetos/${IdObjeto}`);
        const objeto = await res.json();

        if (!res.ok || !objeto) {
            throw new Error("No se pudo obtener el objeto");
        }

        // Establesco los valores en el formulario
        Inputnombre.value = objeto.nombre;
        Inputdescripcion.value = objeto.descripcion;
        Inputcategoria.value = objeto.categoria;
        Inputestado.value = objeto.estado;
        // No establecemos imagen porque el input tipo file no lo permite
    } catch (err) {
        console.error("Error al obtener objeto para editar:", err);
        alert("No se pudo cargar el objeto para editar.");
        cerrarVentana();
        return;
    }

    botonConfirmar.addEventListener("click", async (e) => {
        const nombre = Inputnombre.value.trim();
        const descripcion = Inputdescripcion.value.trim();
        const categoria = Inputcategoria.value;
        const estado = Inputestado.value;
        const imagen = "#"; // Hardcodeado por ahora
        const fecha_publicacion = new Date().toISOString().split("T")[0];

        if (!nombre || !descripcion || !categoria || !estado || !imagen) {
            alert("Por favor complete todos los campos");
            return;
        } else if (nombre.length > 55) {
            alert("El nombre es muy largo");
            return;
        } else if (descripcion.length > 255) {
            alert("La descripción es muy larga");
            return;
        }

        const objetoEditado = {
            nombre,
            descripcion,
            categoria,
            estado,
            fecha_publicacion,
            imagen
        };

        try {
            const res = await fetch(`http://localhost:3000/api/objetos/editar/${IdObjeto}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objetoEditado)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al actualizar el objeto");
            }

            alert("Objeto actualizado correctamente");
            cerrarVentana();
        } catch (err) {
            console.error("Error al actualizar el objeto:", err);
            alert("No se pudo actualizar el objeto");
        }
    });
})
}


function cerrarVentanaEditar() {
    document.getElementById('ventana').style.display = 'none';
    document.getElementById('contenido').innerHTML = '';
    }




