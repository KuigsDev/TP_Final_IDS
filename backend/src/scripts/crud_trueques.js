const {Pool} = require("pg");

const dbClient = new Pool({
    user: "postgres",
    port: 5432,
    host: "postgres",
    database: "trueque_libre",
    password: "postgres"
})

async function updateEstado(estado,id){
    const result = await dbClient.query("UPDATE trueques SET estado = $1 WHERE id = $2", [estado, id]);
    return result;
}
async function createTrueque(objeto_ofrecido_id, objeto_deseado_id, fecha, usuario_solicitante_id){
    const result = await dbClient.query(
            `INSERT INTO trueques (objeto_ofrecido_id, objeto_deseado_id, fecha, usuario_solicitante_id) VALUES ($1, $2, $3, $4)`,
            [objeto_ofrecido_id, objeto_deseado_id, fecha, usuario_solicitante_id]
        );
    return result;
}
async function getTrueque(id){
    const result = await dbClient.query("SELECT * FROM trueques WHERE id = $1", [id]);
    return result;
}
async function updateTrueque(objeto_ofrecido_id, objeto_deseado_id, fecha, truequeId) {
    const update = await dbClient.query(
            `UPDATE trueques SET objeto_ofrecido_id = $1, objeto_deseado_id = $2, fecha = $3 WHERE id = $4`,[objeto_ofrecido_id, objeto_deseado_id, fecha, truequeId]
        );
    return update;
}
async function deleteTrueque(id){
    const result = await dbClient.query("DELETE FROM trueques WHERE id = $1 RETURNING *", [id]);
    return result;
}

module.exports = {
    updateEstado,
    createTrueque,
    getTrueque,
    updateTrueque,
    deleteTrueque,
};