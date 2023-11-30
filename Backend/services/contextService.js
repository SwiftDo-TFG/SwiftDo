const db = require('../bd/pool.js')

const contextService = {}

contextService.createContext = async (context) => {
    if (context !== null && context.length !== 0) {
        let name = "";

        let res = await db.query("INSERT INTO areas_contexts(context_id, name) VALUES ($1, $2)", [context, name]);
        return true;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

contextService.deleteContext = async (context) => {
    if (context !== null && context.length !== 0) {
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

contextService.modifyContext = async (context) => {


}

module.exports = contextService;