const db = require('../bd/pool.js')

const contextService = {}

contextService.createContext = async (context) => {
    if (context !== null && context.length !== 0) {
        let res = await db.query("INSERT INTO areas_contexts(name) VALUES ($1)", [context.name]);
        return true;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

contextService.deleteContext = async (id) => {
    if (id !== null) {
        let res = await db.query('DELETE FROM areas_contexts WHERE context_id = $1', [id]);
        return true;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

contextService.findContext = async (id) => {
    const res = await db.query('SELECT * FROM areas_contexts WHERE context_id = $1', [id])

    if (res.rows.length != 1) {
        throw new Error('The context does not exist');
    }

    return res.rows[0];
}

contextService.modifyContext = async (context, id) => {
    const conn = await db.getClient();

    let res = await conn.query("SELECT * FROM areas_contexts WHERE context_id = $1", [id]);

    if (res.rows.length !== 1) {
        throw new Error('The context does not exist');
    }

    let res2 = await conn.query("UPDATE areas_contexts SET name = $1 WHERE context_id = $2" ,
        [context.name, id]);
    if (res2.rowCount !== 1) {
        throw new Error('The task context not exist');
    } else {
        conn.release();
        return res2.rowCount === 1 ? res2.rows[0].task_id : -1;
    }


}

module.exports = contextService;