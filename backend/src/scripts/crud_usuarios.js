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
//Se hace un SELECT con múltiples LEFT JOIN para traer todo en una sola consulta:
//usuarios u: el usuario principal
//objetos p: los productos publicados por el usuario
//trueques t: todos los trueques donde: el usuario es solicitante o uno de sus productos está involucrado
//objetos o1, o2: el objeto ofrecido y deseado del trueque
//usuarios us, ud: nombres del solicitante y destinatario del trueque
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
    //Se guarda el resultado en rows. Si no hay filas, retorna null.
    if (rows.length === 0) return null;

    //Se arma el objeto usuario
    const usuario = {
        id: rows[0].usuario_id,
        nombre: rows[0].usuario_nombre,
        mail: rows[0].mail,
        ubicacion: rows[0].ubicacion,
        reputacion: rows[0].reputacion,
        imagen: rows[0].usuario_imagen
    };

    //Se usa un Map() para evitar duplicados. Por cada fila:
    //Si hay un producto (producto_id) que no está en el map, se agrega.
    //Guarda nombre, descripción, categoría, imagen, etc.
    const productosPropiosMap = new Map();
    //Se analiza si el usuario participó en trueques con objetos ofrecidos o deseados. Se agregan al map:
    //ofrecido_id y ofrecido_nombre
    //deseado_id y deseado_nombre
    //Aunque el objeto no sea del usuario, se guarda por estar relacionado con él en algún trueque.
    const productosTruequesMap = new Map();
    //Si hay un trueque_id no registrado, se agrega:
    // IDs de objetos ofrecido y deseado
    // Fecha y estado del trueque
    // Quién lo solicitó (nombre)
    // A quién se le ofrece (destinatario)
    const truequesMap = new Map();
    for (const row of rows) {
    const {
        producto_id,
        producto_nombre,
        descripcion,
        categoria,
        producto_estado,
        fecha_publicacion,
        producto_imagen,
        ofrecido_id,
        ofrecido_nombre,
        deseado_id,
        deseado_nombre,
        trueque_id,
        objeto_ofrecido_id,
        objeto_deseado_id,
        trueque_estado,
        trueque_fecha,
        usuario_solicitante_id,
        nombre_solicitante,
        nombre_destinatario
    } = row;

    // Productos propios
    if (producto_id && !productosPropiosMap.has(producto_id)) {
        productosPropiosMap.set(producto_id, {
            id: producto_id,
            nombre: producto_nombre,
            descripcion,
            categoria,
            estado: producto_estado,
            fecha_publicacion,
            imagen: producto_imagen
        });
    }

    // Productos en trueques
    if (ofrecido_id && !productosTruequesMap.has(ofrecido_id)) {
        productosTruequesMap.set(ofrecido_id, {
            id: ofrecido_id,
            nombre: ofrecido_nombre
        });
    }

    if (deseado_id && !productosTruequesMap.has(deseado_id)) {
        productosTruequesMap.set(deseado_id, {
            id: deseado_id,
            nombre: deseado_nombre
        });
    }

    // Trueques
    if (trueque_id && !truequesMap.has(trueque_id)) {
        truequesMap.set(trueque_id, {
            id: trueque_id,
            producto_ofrecido_id: objeto_ofrecido_id,
            producto_deseado_id: objeto_deseado_id,
            estado: trueque_estado,
            fecha: trueque_fecha,
            usuario_solicitante_id,
            nombre_solicitante,
            nombre_destinatario: nombre_destinatario || 'Desconocido'
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



async function createUsuario(nombre, mail, clave, ubicacion, reputacion, imagenUrl) {
    const result = await dbClient.query(
        "INSERT INTO usuarios (nombre, mail, clave, ubicacion, reputacion, imagen) VALUES ($1, $2, $3, $4, $5, $6)",
        [nombre, mail, clave, ubicacion, reputacion, imagenUrl]
    );
    return result;
}

async function mailCheck(mail, idActual = null) {
    let result;
    if(idActual){
        result = await dbClient.query(
            "SELECT 1 FROM usuarios WHERE mail = $1 AND id != $2",
            [mail, idActual]
        );
    }
    else{
        result = await dbClient.query(
        "SELECT 1 FROM usuarios WHERE mail = $1",
        [mail]
        );
    }
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
    createUsuario,
    mailCheck,
    deleteUsuario,
    updateUsuario,
};