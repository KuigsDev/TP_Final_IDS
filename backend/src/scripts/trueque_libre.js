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
async function mailCheck(mail){
    const existe = await dbClient.query("SELECT 1 FROM usuarios WHERE mail = $1", [mail]);
    return existe.rowCount;
}
async function deleteUsuario (mail, clave) {
    const result = await dbClient.query("DELETE FROM usuarios WHERE mail = $1 AND clave = $2",[mail,clave]);
    return result.rowCount;
}
async function updateUsuario(nombre,mail,clave,ubicacion,mail_actual){
    const result = await dbClient.query("UPDATE usuarios SET nombre = $1, mail = $2, clave = $3, ubicacion = $4 WHERE mail = $5",[nombre,mail,clave,ubicacion,mail_actual])
    return result.rowCount;
}

module.exports = {
    getAllUsuarios,
    getOneUsuarios,
    createUsuario,
    mailCheck,
    deleteUsuario,
    updateUsuario,
};