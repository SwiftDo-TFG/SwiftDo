const db = require('../bd/pool.js')

const contextService = {}

contextService.createContext = async (context) => {
    if (context !== null && context.length !== 0) {
        let res = await db.query("INSERT INTO areas_contexts(name, user_id) VALUES ($1, $2) RETURNING context_id", [context.name, context.user_id]);
        return res.rowCount === 1 ? res.rows[0].context_id : -1;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

contextService.deleteContext = async (context_id, user_id) => {
    if (id !== null) {
        let res = await db.query('DELETE FROM areas_contexts WHERE context_id = $1 AND user_id = $2', [context_id, user_id]);
        let res2 = await db.query('UPDATE tasks SET context_id = $1', [null]);
        return true;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

contextService.showContextsByUser = async (user_id) => {

    const res = await db.query("SELECT * FROM areas_contexts WHERE user_id = $1", [user_id]);
    return res.rows;
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

    let res2 = await conn.query("UPDATE areas_contexts SET name = $1 WHERE context_id = $2",
        [context.name, id]);
    if (res2.rowCount !== 1) {
        throw new Error('The task context not exist');
    } else {
        conn.release();
        return res2.rowCount === 1 ? res2.rows[0].task_id : -1;
    }


}

module.exports = contextService;