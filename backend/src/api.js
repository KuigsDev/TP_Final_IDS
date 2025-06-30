const express = require('express');
const app = express ();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/api/health",(req,res)=>{
    res.json({status:"OK"})
});

//get all
app.get("/api/usuarios",(req,res)=>{
    res.json({status:"OK"})
});
//get one
app.get("/api/usuarios/:id",(req,res)=>{
    res.json({status:"OK"})
});
//insert
app.get("/api/usuarios",(req,res)=>{
    res.json({status:"OK"})
});

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});