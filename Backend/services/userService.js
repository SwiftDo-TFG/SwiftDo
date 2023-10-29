// import db from '../bd/pool.js'
const db = require('../bd/pool.js')

const userService = {}

userService.findUserById = async (id)=>{
    const res = await db.query('SELECT * FROM users WHERE user_id = $1', [id])

    if(res.rows.length != 1){
        throw new Error('The user does not exist');
    }

    return res.rows[0];
}

module.exports = userService;