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
async function getMiUsuario(id) {
    const result = await dbClient.query(`
        SELECT 
            u.id AS usuario_id,
            u.nombre AS usuario_nombre,
            u.mail,
            u.ubicacion,
            u.reputacion,
            u.imagen AS usuario_imagen,

            -- Productos del usuario
            p.id AS producto_id,
            p.nombre AS producto_nombre,
            p.descripcion,
            p.categoria,
            p.estado AS producto_estado,
            p.fecha_publicacion,
            p.imagen AS producto_imagen,

            -- Trueques relacionados
            t.id AS trueque_id,
            t.objeto_ofrecido_id,
            t.objeto_deseado_id,
            t.estado AS trueque_estado,
            t.fecha AS trueque_fecha,
            t.usuario_solicitante_id,

            -- Objeto ofrecido (en trueque)
            o1.id AS ofrecido_id,
            o1.nombre AS ofrecido_nombre,

            -- Objeto deseado (en trueque)
            o2.id AS deseado_id,
            o2.nombre AS deseado_nombre,
            t.usuario_solicitante_id,
            us.nombre AS nombre_solicitante,
            ud.nombre AS nombre_destinatario

        FROM usuarios u
        LEFT JOIN objetos p ON p.usuario_id = u.id
        LEFT JOIN trueques t ON 
            t.usuario_solicitante_id = u.id OR
            t.objeto_ofrecido_id = p.id OR
            t.objeto_deseado_id = p.id
        LEFT JOIN objetos o1 ON o1.id = t.objeto_ofrecido_id
        LEFT JOIN objetos o2 ON o2.id = t.objeto_deseado_id
        LEFT JOIN usuarios us ON us.id = t.usuario_solicitante_id  
        LEFT JOIN usuarios ud ON ud.id = o2.usuario_id 
        WHERE u.id = $1; 
    `, [id]);

    const rows = result.rows;

    if (rows.length === 0) return null;

    const usuario = {
        id: rows[0].usuario_id,
        nombre: rows[0].usuario_nombre,
        mail: rows[0].mail,
        ubicacion: rows[0].ubicacion,
        reputacion: rows[0].reputacion,
        imagen: rows[0].usuario_imagen
    };

    const productosPropiosMap = new Map();
    const productosTruequesMap = new Map();
    const truequesMap = new Map();

    for (const row of rows) {
        // Solo productos propios del usuario
        if (row.producto_id && !productosPropiosMap.has(row.producto_id)) {
            productosPropiosMap.set(row.producto_id, {
                id: row.producto_id,
                nombre: row.producto_nombre,
                descripcion: row.descripcion,
                categoria: row.categoria,
                estado: row.producto_estado,
                fecha_publicacion: row.fecha_publicacion,
                imagen: row.producto_imagen
            });
        }

        // Productos que aparecen en trueques (ofrecidos o deseados), aunque no sean propios
        if (row.ofrecido_id && !productosTruequesMap.has(row.ofrecido_id)) {
            productosTruequesMap.set(row.ofrecido_id, {
                id: row.ofrecido_id,
                nombre: row.ofrecido_nombre
            });
        }
        if (row.deseado_id && !productosTruequesMap.has(row.deseado_id)) {
            productosTruequesMap.set(row.deseado_id, {
                id: row.deseado_id,
                nombre: row.deseado_nombre
            });
        }

        // Trueques
        if (row.trueque_id && !truequesMap.has(row.trueque_id)) {
            truequesMap.set(row.trueque_id, {
                id: row.trueque_id,
                producto_ofrecido_id: row.objeto_ofrecido_id,
                producto_deseado_id: row.objeto_deseado_id,
                estado: row.trueque_estado,
                fecha: row.trueque_fecha,
                usuario_solicitante_id: row.usuario_solicitante_id,
                nombre_solicitante: row.nombre_solicitante,
                nombre_destinatario: row.nombre_destinatario || 'Desconocido'
            });
        }
    }

    return {
        usuario,
        productosPropios: Array.from(productosPropiosMap.values()),
        productosTrueques: Array.from(productosTruequesMap.values()),
        trueques: Array.from(truequesMap.values())
    };
}

async function getUsuario(id){
    const result = await dbClient.query("SELECT * FROM usuarios where id = $1",[id]);
    return result;
}



async function createUsuario(nombre, mail, clave, ubicacion, reputacion, imagenUrl) {
    const result = await dbClient.query(
        "INSERT INTO usuarios (nombre, mail, clave, ubicacion, reputacion, imagen) VALUES ($1, $2, $3, $4, $5, $6)",
        [nombre, mail, clave, ubicacion, reputacion, imagenUrl]
    );
    return result.rowCount;
}

async function mailCheck(mail, idActual) {
    const result = await dbClient.query(
        "SELECT 1 FROM usuarios WHERE mail = $1 AND id != $2",
        [mail, idActual]
    );
    return result.rowCount; // Retorna 0 si el mail no está en uso por otro
}

async function deleteUsuario (id) {
    const result = await dbClient.query("DELETE FROM usuarios WHERE id = $1", [id]);
    return result;
}
async function updateUsuario(nombre, mail, clave, ubicacion, imagen, id) {
    if (imagen) {
        return dbClient.query(`
            UPDATE usuarios
            SET nombre = $1, mail = $2, clave = $3, ubicacion = $4, imagen = $5
            WHERE id = $6
        `, [nombre, mail, clave, ubicacion, imagen, id]);
    } else {
        return dbClient.query(`
            UPDATE usuarios
            SET nombre = $1, mail = $2, clave = $3, ubicacion = $4
            WHERE id = $5
        `, [nombre, mail, clave, ubicacion, id]);
    }
}


module.exports = {
    getAllUsuarios,
    getMiUsuario,
    getUsuario,
    createUsuario,
    mailCheck,
    deleteUsuario,
    updateUsuario,
};