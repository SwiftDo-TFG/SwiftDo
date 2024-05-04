const db = require('../bd/pool.js')
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const configService = {}

configService.createClient = async(client_info) => {
    
    //COMPROBAR PRIMERO SI EXISTE
    let res = await db.query("SELECT * FROM oauth_clients WHERE client_id = $1", [client_info.client_id]);

    if(res.rowCount === 0){
        client_info.client_secret = await generateSecret();
        client_info.grants = "authorization_code,refresh_token";
    
        res = await db.query("INSERT INTO public.oauth_clients(client_id, client_secret, redirect_uri, grants)" 
                        + "VALUES($1, $2, $3, $4) RETURNING *", [client_info.client_id, client_info.client_secret, client_info.redirect_uri, client_info.grants]);
    }

    return res.rows[0];
}

async function generateSecret(){
    let secret = crypto.randomBytes(20).toString('hex');
    const saltRounds = 10;

    const hashsecret = await bcrypt.hash(secret, saltRounds);

    return hashsecret;
}


module.exports = configService;