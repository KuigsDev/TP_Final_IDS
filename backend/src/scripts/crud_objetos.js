const { Pool } = require("pg");

const dbClient = new Pool({
    user: "postgres",
    port: 5432,
    host: "localhost",
    database: "trueque_libre",
    password: "postgres"
});

async function getAllObjetos() {
    const result = await dbClient.query("SELECT * FROM objetos");
    return result.rows;
}

async function getOneObjeto(id) {
    const result = await dbClient.query("SELECT * FROM objetos WHERE id = $1", [id]);
    return result.rows[0];
}

async function getFromUsuario(usuarioId) {
    const result = await dbClient.query("SELECT * FROM objetos WHERE usuario_id = $1", [usuarioId]);
    return result.rows;
}

async function getObjetosRecientes() {
    const result = await dbClient.query("SELECT * FROM objetos ORDER BY id DESC LIMIT 10");
    return result.rows;
}

async function createObjeto(nombre, descripcion, categoria, estado, fecha_publicacion, imagen, usuario_id) {
    const result = await dbClient.query(
        "INSERT INTO objetos (nombre, descripcion, categoria, estado, fecha_publicacion, imagen, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [nombre, descripcion, categoria, estado, fecha_publicacion, imagen, usuario_id]
    );
    return result.rowCount;
}

async function deleteObjeto(id) {
    const result = await dbClient.query("DELETE FROM objetos WHERE id = $1", [id]);
    return result.rowCount;
}

async function updateObjeto(id, nombre, descripcion, categoria, estado, imagen) {
    const result = await dbClient.query(
        "UPDATE objetos SET nombre = $1, descripcion = $2, categoria = $3, estado = $4, imagen = $5 WHERE id = $6",
        [nombre, descripcion, categoria, estado, imagen, id]
    );
    return result.rowCount;
}

module.exports = {
    getAllObjetos,
    getOneObjeto,
    getFromUsuario,
    getObjetosRecientes,
    createObjeto,
    deleteObjeto,
    updateObjeto
};
