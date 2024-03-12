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
    const res = await db.query('select t.name, t.colour from tags t join tagstotask tt on t.name = tt.nametag join tasks tk on tk.task_id = tt.task_id where tk.user_id = $1 and lower(t.name) like lower($2) order by t.name asc limit 5', [id, search])

    if (res.rows.length < 1) {
        return false;
    }

    return res.rows;
}



module.exports = tagService;