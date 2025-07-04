const express = require('express');
const app = express ();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const {
    getAllUsuarios,
    getOneUsuarios,
    createUsuario,
    mailCheck,
    deleteUsuario,
    updateUsuario,
} = require("./scripts/crud_usuarios");


// Ver que la API este funcionando
app.get("/api/health",(req,res)=>{
    res.json({status:"OK"})
});

//get all
app.get("/api/usuarios", async(req,res)=>{
    const usuarios =await getAllUsuarios();
    res.json(usuarios);
});
//get one
app.get("/api/usuarios/:id",async(req,res)=>{
    const usuario =await getOneUsuarios(req.params.id);
    if (!usuario){
        return res.status(404).json({error:"usuario not found"});
    }
    res.json(usuario);
});
//insert
app.post("/api/usuarios",async(req,res)=>{

    if (!req.body){
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    else if (!req.body.nombre || !req.body.mail || !req.body.clave || !req.body.ubicacion) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{
        const existe = await mailCheck(req.body.mail)
        if (existe > 0) {
            return res.status(409).json({ error: "El mail ya está registrado" });
        }
        else{
            const usuario =await createUsuario(
                req.body.nombre,
                req.body.mail,
                req.body.clave,
                req.body.ubicacion,
                3
            );
            res.status(201).json({ message: "Usuario creado", filasAfectadas: usuario });
        }
    }
});
//delete
app.delete("/api/usuarios",async(req,res)=>{
    const { mail, clave } = req.body;
    if(!mail || !clave){
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{
        const filasAfectadas = await deleteUsuario(mail, clave);

        if (filasAfectadas > 0) {
            return res.status(200).json({ message: "Usuario eliminado", filasAfectadas });
        } else {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
        
    }
});
//update
app.put("/api/usuarios",async(req,res)=>{
    const {nombre,mail,clave,ubicacion,mail_actual} = req.body;
    if (!nombre || !mail || !clave || !ubicacion || !mail_actual){
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    else{
        const usuario = updateUsuario(nombre,mail,clave,ubicacion,mail_actual);
        return res.status(200).json({ message: "Usuario actualizado", usuario});
    }
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

const {    
    getAllObjetos,
    getOneObjeto,
    getFromUsuario,
    getOBjetosRecientes,
    createObjeto,
    deleteObjeto,
    updateOBjeto} = require("./scripts/crud_objetos");


app.get("/api/objetos", async(req,res) =>{
    const objetos = await getAllObjetos();
    res.json(objetos);
});

app.get("/api/objetos/:id", async(req,res)=>{
    const objeto = await getOneObjeto(req.params.id);
    res.json(objeto);
});

app.get("/api/usuarios/objetos/:id", async (req,res) =>{
    console.log("PRPARP...")
    const objetos = await getFromUsuario(req.params.id)
    res.json(objetos)
});

app.post("/api/objetos/:id",async(req,res) => {
    if(!req.body){
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    else if ( !req.body.nombre || !req.body.descripcion || !req.body.categoria || !req.body.imagen || !req.body.estado || !req.body.fecha_publicacion ) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }
    else{
        const objetos = await createObjeto(
            req.body.nombre,
            req.body.descripcion,
            req.body.categoria,
            req.body.estado,
            req.body.fecha_publicacion,
            req.body.imagen,
            req.params.id
        );
        res.status(201).json({ message: "Objeto publicado", filasAfectadas: objetos });
    }
});



