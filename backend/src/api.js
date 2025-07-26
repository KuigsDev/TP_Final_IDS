const express = require('express');
const app = express ();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const path = require('path');
const multer = require('multer');
const fs = require('fs');
app.use('/img/usuarios', express.static(path.join(__dirname, 'img/usuarios')));
app.use('/img/objetos', express.static(path.join(__dirname, 'img/objetos')));

const createFolderIfNotExists = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Asegúrate de que la carpeta exista
const uploadPath = path.join(__dirname, 'img/usuarios');
const uploadObjetosPath = path.join(__dirname, 'img/objetos');

createFolderIfNotExists(uploadPath);
createFolderIfNotExists(uploadObjetosPath);

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Leer archivos existentes para contar cuántos hay
        fs.readdir(uploadPath, (err, files) => {
            if (err) return cb(err);

            // Filtrar solo archivos con extensión de imagen
            const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
            const newId = imageFiles.length + 1;

            const ext = path.extname(file.originalname); // conserva la extensión original
            const filename = `${newId}${ext}`;

            cb(null, filename);
        });
    }
});
const upload = multer({ storage });

const storageObjetos = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadObjetosPath);
    },
    filename: function (req, file, cb) {
        // Leer archivos existentes en la carpeta de objetos
        fs.readdir(uploadObjetosPath, (err, files) => {
            if (err) return cb(err);

            // Filtrar archivos que sean imágenes
            const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
            const newId = imageFiles.length + 1;

            const ext = path.extname(file.originalname); // extensión del archivo original
            const filename = `${newId}${ext}`; // nombre final: 1.jpg, 2.png, etc.

            cb(null, filename);
        });
    }
});


const uploadObjeto = multer({ storage: storageObjetos });

const {
    getAllUsuarios,
    getMiUsuario,
    getUsuario,
    createUsuario,
    mailCheck,
    deleteUsuario,
    updateUsuario,
} = require("./scripts/crud_usuarios");

const cors = require('cors');
app.use(cors());


// Ver que la API este funcionando
app.get("/api/health", async(req,res)=>{
    res.json({status:"Hola"})
});

// Retorna todos los usuarios
app.get("/api/usuarios", async(req,res)=>{
    const usuarios =await getAllUsuarios();
    res.json(usuarios);
});

//Devuelve toda la información del perfil de un usuario
//Datos del usuario
//Objetos publicados
//Los trueques en los que participó
//Los objetos involucrados en esos trueques
app.get("/api/usuarios/:id",async(req,res)=>{
    try {
        const data = await getMiUsuario(req.params.id);
        if (!data) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(data);
    } catch (error) {
        console.error("Error en /api/usuario/:id", error);
        res.status(500).json({ error: "Error interno" });
    }
});

//Retorna un unico usuario
app.get("/api/usuario/:id", async (req, res) => {
    try {
        const data = await getUsuario(req.params.id);
        if (!data || data.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ usuario: data.rows[0] });
    } catch (error) {
        console.error("Error en /api/usuario/:id", error);
        res.status(500).json({ error: "Error interno" });
    }
});

//Registra a un usuario en el sistema solo si el correo no está repetido
app.post("/api/usuarios", upload.single("imagen"), async (req, res) => {
    const { nombre, mail, clave, ubicacion } = req.body;

    if (!nombre || !mail || !clave || !ubicacion || !req.file) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const yaExiste = await mailCheck(mail);
        if (yaExiste > 0) {
            return res.status(409).json({ error: "El mail ya está registrado" });
        }

        let imagen = null;
        if (req.file) {
            imagen = `/img/usuarios/${req.file.filename}`;
        }

        const reputacion = 3;

        const result = await createUsuario(nombre, mail, clave, ubicacion, reputacion, imagen);
        if (result.rowCount > 0) {
            return res.status(201).json({ message: "Usuario registrado correctamente" });
        } else {
            return res.status(500).json({ error: "No se pudo registrar el usuario" });
        }
    } catch (error) {
        console.error("Error en POST /api/usuarios:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
});



//Actualiza un usuario
app.put("/api/usuarios/:id", upload.single('imagen'), async (req, res) => {
    const id = req.params.id;
    const { nombre, mail, clave, ubicacion } = req.body;

    if (!id || !nombre || !mail || !clave || !ubicacion) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const yaUsado = await mailCheck(mail, id);
    if (yaUsado > 0) {
        return res.status(409).json({ error: "El mail ya está registrado por otro usuario" });
    }

    let imagen = null;
    if (req.file) {
        imagen = `/img/usuarios/${req.file.filename}`;
    }

    try {
        const result = await updateUsuario(nombre, mail, clave, ubicacion, imagen, id);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Usuario actualizado correctamente" });
        } else {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error("Error en PUT /api/usuarios/:id", err);
        return res.status(500).json({ error: "Error del servidor" });
    }
});


//Borra un usuario
app.delete("/api/usuarios/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: "Falta el ID" });
    }
    try {
        const result = await deleteUsuario(id);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Usuario eliminado" });
        } else {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error del servidor" });
    }
});



app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

const {    
    getAllObjetos,
    getOneObjeto,
    getWhereNotUsuario,
    getFromUsuario,
    getObjetosRecientes,
    createObjeto,
    deleteObjeto,
    getRecentsObjects, 
    getObjects,
    updateObjeto} = require("./scripts/crud_objetos");


//Retorna todos los objetos
app.get("/api/objetos", async(req,res) =>{
    const objetos = await getAllObjetos();
    res.json(objetos);
});

//funciones del main: 

app.get('/api/objetos_recientes', async(req,res)=>{
    try{
        const objetos = await getRecentsObjects();
        if(objetos){
            res.json({
                success: true, 
                objetos: objetos 
            })
        }else{
            res.status(500).json({
                success: false, 
                message: "Error del servidor, no se pudo recuperar objetos"
            })
        }
    }catch(e){
        res.status(500).send("Error: ",e); 
    }
})  

app.get('/api/objetos_todos', async(req,res)=>{
    try{
        const objetos = await getObjects(); 
        if(objetos){
            res.json({
                success: true, 
                objetos: objetos
            })
        }else{
            res.status(500).json({
                successs: false,    
                meessage: "Error del servidor, no se pudo recuperar objetos"
            })
        }
    }catch(e){
        res.status(500).send("Error: ",e);
    }
})

//Retorna los ultimos 9 objetos mas recientes con nombre del dueño
app.get("/api/objetos/recientes", async (req, res) => {
    try {
        const result = await getObjetosRecientes();
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener objetos recientes:", err);
        res.status(500).json({ error: "Error al obtener objetos recientes" });
    }
});

//Retorna un objeto
app.get("/api/objetos/:id", async(req,res)=>{
    const objeto = await getOneObjeto(req.params.id);
    res.json(objeto);
});

//Retorna objetos de un usuario
app.get("/api/usuarios/objetos/:id", async (req,res) =>{
    try {
        const objetos = await getFromUsuario(req.params.id);
        res.json(objetos);
    } catch (error) {
        console.error("Error al obtener objetos:", error);
        res.status(500).json({ error: "Error al obtener objetos" });
    }
});
//Retorna objetos que no son de un usuario
app.get("/api/objetos/otros/:id", async (req, res) => {
    const solicitanteId = req.params.id;
    try {
        const result = await getWhereNotUsuario(solicitanteId);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener objetos de otros usuarios:", error);
        res.status(500).json({ error: "Error al obtener objetos deseados" });
    }
});

//Publicar objetos
app.post("/api/objetos/:id",uploadObjeto.single('imagen'),async(req,res) => {
    if(!req.body){
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }


    else if ( !req.body.nombre || !req.body.descripcion || !req.body.categoria || !req.file || !req.body.estado || !req.body.fecha_publicacion ) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
    else{
        const imagen = `/img/objetos/${req.file.filename}`;
        const objetos = await createObjeto(
            req.body.nombre,
            req.body.descripcion,
            req.body.categoria,
            req.body.estado,
            req.body.fecha_publicacion,
            imagen,
            req.params.id
        );
        res.status(201).json({ message: "Objeto publicado", filasAfectadas: objetos });
    }
});

//Editar objeto publicado
app.put("/api/objetos/editar/:id",uploadObjeto.single('imagen'), async (req,res) =>{
    if (!req.body){
        return res.status(400).json({ error: "No realizo cambio en el producto"});
    }
    // Los datos quedan en req.body y el archivo en req.file (si subieron)
    const { nombre, descripcion, categoria, estado } = req.body;
    let imagen = null;
    if (req.file) {
        // Aquí podés usar req.file.path o renombrar / mover la imagen
        imagen = `/img/objetos/${req.file.filename}`; // O la ruta que guardes
    }

    try {
        const filasAfectadas = await updateObjeto(
            req.params.id,
            nombre,
            descripcion,
            categoria,
            estado,
            imagen
        );

        res.status(201).json({ message: "Objeto editado", filasAfectadas });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el objeto" });
    }
});

//Borrar objeto 
app.delete('/api/objetos/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await deleteObjeto(id);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});




const {    
    updateEstado,
    createTrueque,
    getTrueque,
    updateTrueque,
    deleteTrueque,
    } = require("./scripts/crud_trueques");


//Actualiza el estado de un trueque segun el usurio destinatario Acepte o Rechace el trueque
app.put("/api/trueques/:id", async (req, res) => {
    const { estado } = req.body;
    const { id } = req.params;

    if (!["aceptado", "rechazado"].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido" });
    }

    const result = await updateEstado(estado,id);

    if (result.rowCount > 0) {
        res.status(200).json({ mensaje: "Estado actualizado correctamente" });
    } else {
        res.status(404).json({ error: "Trueque no encontrado" });
    }
});

//Solicita un trueque a un usuario
app.post("/api/trueques", async (req, res) => {
    const {
        objeto_ofrecido_id,
        objeto_deseado_id,
        fecha,
        usuario_solicitante_id
    } = req.body;

    if (!objeto_ofrecido_id || !objeto_deseado_id || !fecha || !usuario_solicitante_id) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    if (isNaN(objeto_ofrecido_id) || isNaN(objeto_deseado_id) || isNaN(usuario_solicitante_id)) {
        return res.status(400).json({ error: "Los IDs deben ser números válidos." });
    }

    try{
        const result = await createTrueque(objeto_ofrecido_id,objeto_deseado_id,fecha,usuario_solicitante_id);
        res.status(201).json({ mensaje: "Trueque creado con éxito" });
    } catch (error) {
        console.error("Error al crear trueque:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
//El Solicitante puede editar el trueque
app.put("/api/trueques/editar/:id", async (req, res) => {
    const truequeId = req.params.id;
    const { objeto_ofrecido_id, objeto_deseado_id, fecha, usuario_solicitante_id } = req.body;

    if (!objeto_ofrecido_id || !objeto_deseado_id || !fecha || !usuario_solicitante_id) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const result = await getTrueque(truequeId);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Trueque no encontrado" });
        }

        const trueque = result.rows[0];

        if (trueque.estado !== "Pendiente") {
            return res.status(400).json({ error: "Solo se pueden editar trueques en estado Pendiente" });
        }

        if (parseInt(trueque.usuario_solicitante_id) !== parseInt(usuario_solicitante_id)) {
            return res.status(403).json({ error: "No estás autorizado a editar este trueque" });
        }

        const update = await updateTrueque(objeto_ofrecido_id, objeto_deseado_id, fecha, truequeId);

        res.json({ mensaje: "Trueque actualizado"});

    } catch (err) {
        console.error("Error actualizando trueque:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

//Retorna un trueque
app.get("/api/trueques/:id", async (req, res) => {
    const result = await getTrueque(req.params.id);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Trueque no encontrado" });
    }
    res.json(result.rows[0]);
});

//El solicitante puede borrar un trueque
app.delete("/api/trueques/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await deleteTrueque(id);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Trueque no encontrado" });
        }

        res.json({ mensaje: "Trueque eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar trueque:", error);
        res.status(500).json({ error: "Error al eliminar trueque" });
    }
});





