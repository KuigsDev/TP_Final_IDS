const {Pool} = require("pg");

const dbClient = new Pool({
    user: "postgres",
    port: 5432,
    host: "postgres",
    database: "trueque_libre",
    password: "postgres"
})
async function getAllUsuarios(){
    const result = await dbClient.query("SELECT * FROM usuarios");
    return result.rows;
}
async function getMiUsuario(id){
    const result = await dbClient.query(
        `
    SELECT 
    u.id AS usuario_id,
        u.nombre AS usuario_nombre,
        u.mail,
        u.ubicacion,
        u.reputacion,
        u.imagen AS usuario_imagen,
        p.id AS producto_id,
        p.nombre AS producto_nombre,
        p.descripcion,
        p.categoria,
        p.estado AS producto_estado,
        p.fecha_publicacion,
        p.imagen AS producto_imagen,
        t.id AS trueque_id,
        t.producto_ofrecido_id,
        t.producto_deseado_id,
        t.estado AS trueque_estado,
        t.fecha AS trueque_fecha,
        t.usuario_solicitante_id
    FROM usuarios u
    LEFT JOIN producto p ON u.id = p.usuario_id
    LEFT JOIN trueque t ON t.producto_ofrecido_id = p.id OR t.producto_deseado_id = p.id
    WHERE u.id = $1;
    `,
    [id]
    )
    const rows = result.rows;

    if (rows.length === 0) return null;

    // Tomamos los datos del usuario de la primera fila
    const usuario = {
        id: rows[0].usuario_id,
        nombre: rows[0].usuario_nombre,
        mail: rows[0].mail,
        ubicacion: rows[0].ubicacion,
        reputacion: rows[0].reputacion,
        imagen: rows[0].usuario_imagen
    };

    // Agrupamos productos únicos
    const productosMap = new Map();
    const truequesMap = new Map();

    for (const row of rows) {
        // Productos
        if (row.producto_id && !productosMap.has(row.producto_id)) {
        productosMap.set(row.producto_id, {
            id: row.producto_id,
            nombre: row.producto_nombre,
            descripcion: row.descripcion,
            categoria: row.categoria,
            estado: row.producto_estado,
            fecha_publicacion: row.fecha_publicacion,
            imagen: row.producto_imagen
        });
        }

        // Trueques
        if (row.trueque_id && !truequesMap.has(row.trueque_id)) {
        truequesMap.set(row.trueque_id, {
            id: row.trueque_id,
            producto_ofrecido_id: row.producto_ofrecido_id,
            producto_deseado_id: row.producto_deseado_id,
            estado: row.trueque_estado,
            fecha: row.trueque_fecha,
            usuario_solicitante_id: row.usuario_solicitante_id
        });
        }
    }

    return {
        usuario,
        productos: Array.from(productosMap.values()),
        trueques: Array.from(truequesMap.values())
    };
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
    getMiUsuario,
    createUsuario,
    mailCheck,
    deleteUsuario,
    updateUsuario,
};