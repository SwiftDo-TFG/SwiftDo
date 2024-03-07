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



module.exports = tagService;