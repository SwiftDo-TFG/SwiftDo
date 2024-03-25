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

tagService.getAllTagsByUser = async (id, search) => {
    const res = await db.query('SELECT DISTINCT t.name, t.colour FROM tags t JOIN tagstotask tt ON t.name = tt.nametag JOIN tasks tk ON tk.task_id = tt.task_id WHERE tk.user_id = $1 AND LOWER(t.name) LIKE LOWER($2) ORDER BY t.name ASC LIMIT 5', [id, search])

    if (res.rows.length < 1) {
        return false;
    }

    return res.rows;
}



module.exports = tagService;