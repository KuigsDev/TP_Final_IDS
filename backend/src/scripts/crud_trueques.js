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

module.exports = {
    updateEstado,
};