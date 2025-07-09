const { Pool } = require('pg');

const dbClient = new Pool({
    user: "postgres", 
    password: "postgres", 
    host: "localhost", 
    port: 5432, 
    database: "trueque_libre"
})


async function getUser(email, clave){
    try{
        const response = await dbClient.query('SELECT nombre,mail,ubicacion,reputacion,imagen FROM usuarios WHERE mail = $1 AND clave = $2',[email,clave]); 
        if(response.rows.length === 0 ){
            return undefined
        }
        return response.rows[0]; 
    }catch{
        return undefined
    }
}


module.exports={
    getUser
}

