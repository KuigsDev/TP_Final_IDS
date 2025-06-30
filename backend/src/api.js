const express = require('express');
const app = express ();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const {
    getAllUsuarios,
    getOneUsuarios,
    createUsuario,
} = require("./scripts/trueque_libre");

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
    try{
    const usuario =await createUsuario(
        req.body.nombre,
        req.body.mail,
        req.body.clave,
        req.body.ubicacion,
        req.body.reputacion
    );
    res.status(201).json({ message: "Usuario creado", filasAfectadas: usuario });
    }
    catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});
//delete
app.delete("/api/usuarios/:id",(req,res)=>{
    res.json({status:"OK"})
});
//update
app.put("/api/usuarios/:id",(req,res)=>{
    res.json({status:"OK"})
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});