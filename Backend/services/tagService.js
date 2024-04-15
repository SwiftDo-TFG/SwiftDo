const db = require('../bd/pool.js')

const tagService = {}

tagService.createTag = async (tag) => {
    if (tag.name !== null && tag.name.length !== 0) {

        let res = await db.query("INSERT INTO tags(name, colour) VALUES ($1, $2) RETURNING name", [tag.name, tag.color]);
        return res;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

tagService.findTag = async (tag) => {
    const res = await db.query('SELECT * FROM tags WHERE name = $1', [tag])

    if (res.rows.length !== 1) {
        return false;
    }

    return res.rows[0];
}

tagService.getAllTagsByUserLimit = async (id, search) => {
    const res = await db.query('SELECT DISTINCT t.name, t.colour FROM tags t JOIN tagstotask tt ON t.name = tt.nametag JOIN tasks tk ON tk.task_id = tt.task_id WHERE tk.user_id = $1 AND LOWER(t.name) LIKE LOWER($2) ORDER BY t.name ASC LIMIT 5', [id, search])

    if (res.rows.length < 1) {
        return false;
    }

    return res.rows;
}

tagService.getAllTagsByUser = async (id) => {
    const res = await db.query('SELECT DISTINCT t.name, t.colour FROM tags t JOIN tagstotask tt ON t.name = tt.nametag JOIN tasks tk ON tk.task_id = tt.task_id WHERE tk.user_id = $1 ORDER BY t.name ASC', [id])

    if (res.rows.length < 1) {
        return false;
    }
    return res.rows;
}

tagService.deleteTag = async (tag) => {
    if (tag !== null) {
        let res = await db.query('DELETE FROM tagstotask WHERE nametag = $1', [tag]);
        let res2 = await db.query('DELETE FROM tags WHERE name = $1', [tag]);
        return true;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

module.exports = tagService;