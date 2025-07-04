const {Pool} = require("pg");

const dbClient = new Pool({
    user: "postgres",
    port: 5432,
    host: "localhost",
    database: "trueque_libre",
    password: "postgres"
})

async function getAllObjetos(){
    const result = await dbClient.query("SELECT * FROM producto");
    return result.rows;
}

async function getOneObjeto(numero) {
    const result = await dbClient.query("SELECT * FROM producto WHERE id = $1",[numero]);
    return result.rows[0];
}

async function getFromUsuario(id) {
    const result = await dbClient.query("SELECT * FROM producto WHERE usuario_id = $1",[id]);
    return result.rows;
}



async function getOBjetosRecientes() {
    const result = await dbClient.query("select * from producto order by id desc limit 10",);
    return result.rows;
}

async function createObjeto(nombre,descripcion,categoria,estado,fecha_publicacion,imagen,usuario) {
    const result = await dbClient.query("INSERT INTO producto (nombre,descripcion,categoria,estado,fecha_publicacion,imagen,usuario_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",[nombre,descripcion,categoria,estado,fecha_publicacion,imagen,usuario]);
    return result.rowCount;
}

async function deleteObjeto(id) {
    const result = await dbClient.query("DELETE FROM producto  where id = $1",[id]);
    return result.rowCount;
}

async function updateOBjeto(nombre,descripcion,categoria,estado,imagen) {
    const result = await dbClient.query("UPDATE producto SET nombre = $1, descripcion = $2, categoria = $3, estado = $4, imagen = $5 ",[nombre,descripcion,categoria,estado,imagen]);
    return result.rowCount;
}


module.exports = {
    getAllObjetos,
    getOneObjeto,
    getFromUsuario,
    getOBjetosRecientes,
    createObjeto,
    deleteObjeto,
    updateOBjeto
}