const express = require("express"); 
const app = express(); 
const cors = require("cors"); 
const port = 3000; 
const { getUser } = require("./db/usuario.js")



app.use(cors());
app.use(express.json());


app.post('/api/login', async(req,res)=>{
    const { email, clave } = req.body; 
    console.log("esto llega a la api",email,clave)
    const usuario = await getUser(email, clave); //llega de la db 
    if(usuario){
        res.json({
            success: true, 
            user: usuario
        })
    }else{
        res.status(404).json({
            success: false, 
            message: "Credenciales incorrectas"
        })
    }
}); 


app.listen(port, ()=>{
    console.log("API corriendo en el puerto "+port);
})