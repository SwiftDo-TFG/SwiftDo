const db = require('../bd/pool.js')

const tagService = {}

const colours = ['#c93c20', '#6455d2', '#337474', '#5b6597', '#926442', '#490085', '#2c73c5', '#184bc0', '#b5541b', '#d32778', '#6e1249', '#20825b', '#ae2a32', '#11680c', '#3b7a5c']

let colorIndex = 0;

tagService.createTag = async (tag) => {
    if (tag !== null && tag.length !== 0) {

        let res = await db.query("INSERT INTO tags(name, colour) VALUES ($1, $2) RETURNING name", [tag, addColor()]);
        return true;
    } else {
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

tagService.findTag = async (tag) => {
    const res = await db.query('SELECT * FROM tags WHERE name = $1', [tag])

    if(res.rows.length !== 1){
        throw new Error('The tag does not exist');
    }

    return res.rows[0];
}

function addColor(){
    const color = colours[colorIndex];
    colorIndex = (colorIndex + 1) === colours.length ? 0 : colorIndex + 1;
    return color;
}


module.exports = tagService;