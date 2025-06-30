const {Pool} = require("pg");

const dbClient = new Pool({
    user: "postgres",
    port: 5432,
    host: "localhost",
    database: "trueque_libre",
    password: "postgres"
})

async function getAllUsuarios(){
    const result = await dbClient.query("SELECT * FROM usuarios");
    return result.rows;
}
async function getOneUsuarios(id){
    const result = await dbClient.query("SELECT * FROM usuarios WHERE id = $1",[id]);
    return result.rows[0];
}
async function createUsuario(nombre,mail,clave,ubicacion,reputacion){
    const result = await dbClient.query("INSERT INTO usuarios (nombre,mail,clave,ubicacion,reputacion) VALUES ($1,$2,$3,$4,$5)",
        [nombre,mail,clave,ubicacion,reputacion]);
    return result.rowCount;
}

module.exports = {
    getAllUsuarios,
    getOneUsuarios,
    createUsuario
};