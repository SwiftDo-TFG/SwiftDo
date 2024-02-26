const db = require('../bd/pool.js')
const tagService = require('./tagService.js')

const taskService = {}

//Common queries
const querySearchByID = "SELECT * FROM tasks WHERE task_id = $1"
const querySearchByListIDS = "SELECT * FROM tasks WHERE task_id = ANY($1) and user_id = $2"


taskService.createTask = async (task_data)=>{
    const task = completeTaskDefValues(task_data)

    if(task.user_id && task.title && task.title.length !== 0){
        let res = await db.query("INSERT INTO tasks(user_id, context_id, project_id, title, description, state, completed, verification_list, important_fixed, date_added, date_completed, date_limit, date_changed, num_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING task_id",
            [task.user_id, task.context_id, task.project_id, task.title, task.description, task.state, task.completed, task.verification_list, task.important_fixed, task.date_added, task.date_completed, task.date_limit, task.date_changed, task.num_version]);

        return res.rowCount === 1 ? res.rows[0].task_id: -1;
    }else{
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

taskService.modifyTask = async (task_id, task)=>{
    const conn = await db.getClient();

    let res = await conn.query(querySearchByID, [task_id]);

    if(res.rows.length !== 1){
        throw new Error('The task does not exist');
    }
    task = updateTaskDefValues(res.rows[0], task);

    if(task.user_id !== 0){ 
        let res = await conn.query("UPDATE tasks SET user_id = $1, context_id = $2, project_id = $3, title = $4, description = $5, state = $6, verification_list = $7, important_fixed = $8, date_added = $9, date_completed = $10, date_limit = $11, date_changed = $12, num_version = $13, completed = $14 WHERE task_id = $15 RETURNING task_id",
            [task.user_id, task.context_id, task.project_id, task.title, task.description, task.state, task.verification_list, task.important_fixed, task.date_added, task.date_completed, task.date_limit, task.date_changed, task.num_version, task.completed, task_id]);
        if(res.rowCount !== 1){
            throw new Error('The task does not exist');
        }else{
            conn.release();
            return res.rowCount === 1 ? res.rows[0].task_id: -1;
        }
    }else{
        throw new Error("Tienen que estar rellenos los campos indicados");
    }

}

taskService.findTaskById = async (id)=>{
    const res = await db.query(querySearchByID, [id])

    if(res.rows.length !== 1){
        throw new Error('The task does not exist');
    }

    return res.rows[0];
}

taskService.findTasksByFilters = async (user_id, filters)=>{
    const filterdQuery = addFiltersToQuery('SELECT t.*, p.color as project_color, p.title as project_title FROM tasks t LEFT JOIN Projects p on t.project_id = p.project_id WHERE t.user_id = $1', filters);
    filterdQuery.values.unshift(user_id);

    const res = await db.query(filterdQuery.query, filterdQuery.values)

    return res.rows;
}

taskService.findTaskByUserId = async (id)=>{
    const res = await db.query('SELECT t.* , p.color as project_color, p.title as project_title FROM tasks t LEFT JOIN projects p on t.project_id = p.project_id WHERE t.user_id = $1 AND t.completed is not true', [id])

    return res.rows;
}

taskService.addTag = async (id, tag)=>{
    const task = await db.query(querySearchByID, [id])

    if(task.rows.length !== 1){
        throw new Error('The task does not exist')
    }
    else{
        const t = await tagService.findTag(tag);
        if(!t){
            await tagService.createTag(tag);
        }
        const intermediate = await db.query('SELECT * FROM TagsToTask WHERE task_id = $1 AND nameTag = $2', [id, tag])
        if(intermediate.rows.length !== 1){
            const res = await db.query('INSERT INTO TagsToTask (task_id, nameTag) VALUES ($1,$2)', [id, tag])
            return true;
        }
        else{
            throw new Error('The tag was relationate to the task')
        }
    }
    
}

taskService.moveList = async (user_id, list_ids, state) => {
    const conn = await db.getClient();
    let res = await conn.query(querySearchByListIDS, [list_ids, user_id]);

    if(res.rows.length !== list_ids.length){
        conn.release();
        throw new Error('Unexpected Error')
    }
    let setStatement = "SET state = $1";

    if(res.rows.length > 0 && res.rows[0].state === '3'){
        setStatement = setStatement.concat(", date_limit = null ");
    }

    if(state === '3'){
        setStatement = setStatement.concat(", date_limit = current_date");
    }

    const query = "UPDATE tasks "+ setStatement + " WHERE task_id = ANY($2) and user_id = $3"
    
    res = await conn.query(query, [state, list_ids, user_id]);
    conn.release();

    return {moved: res.rowCount};
}


taskService.completeList = async (user_id, list_ids, completed) => {
    const conn = await db.getClient();
    let res = await conn.query(querySearchByListIDS, [list_ids, user_id]);
    console.log(completed)
    if(res.rows.length !== list_ids.length){
        conn.release();
        throw new Error('Unexpected Error')
    }
    let setStatement = "SET completed = $1 , date_completed = current_date";

    const query = "UPDATE tasks " + setStatement + " WHERE task_id = ANY($2) and user_id = $3"
    
    res = await conn.query(query, [completed, list_ids, user_id]);
    conn.release();

    return {completed: res.rowCount};
}


// Obtenemos los datos de la sesion del usuario y las tareas asociadas segun el action.
taskService.getInfo = async(user_id, state) => {
    const res = await db.query('SELECT count (*) as total FROM tasks where user_id = $1 and state = $2 and completed is false group by important_fixed', [user_id, state])
    return res.rows;
}

taskService.newgetInfo = async(user_id, state) => {
    const res = await db.query('SELECT count (*) as total, state , important_fixed FROM tasks  where user_id = $1 and completed is false  group by important_fixed, state order by state, important_fixed', [user_id])
    
    let info = {
        1: {total: 0, important: 0},
        2: {total: 0, important: 0},
        3: {total: 0, important: 0},
        4: {total: 0, important: 0},
    }
    res.rows.forEach(e => {
        if(e.state != null){
            e.important_fixed ? info[e.state].important = parseInt(e.total) : info[e.state].total = parseInt(e.total);
        }
    })

    return info;
}


function completeTaskDefValues(task){
    if(!task.user_id || !task.title || task.title.length === 0){
        throw new Error('Invalid Task data');
    }

    if(!task.state){
        task.state = 1; //Inbox default
    }
    task.completed = false;
    task.date_added = new Date();
    task.date_changed = new Date();
    task.num_version = 1;
    
    if(task.important_fixed){
        task.important_fixed = false;
    }

    if(task.date_limit){
        console.log("TASK DATE LIMIT CREATE", task.date_limit, new Date(task.date_limit).getTime(), new Date(2024, 2, 26).getTime())
        task.date_limit = new Date(new Date(task.date_limit).getTime())
    }
    
    return task
}

function updateTaskDefValues(task, newTask){
    
    
    if(!task.user_id || (task.title && task.title.length === 0)){
        throw new Error('Invalid Task data');
    }
    
    task.date_changed = new Date();
    task.num_version = parseInt(task.num_version);
    task.num_version += 1;

    if(newTask.completed){
        task.date_completed = new Date();
    }

    if(newTask.state !== task.state && parseInt(task.state) === 3){
        task.date_limit = null;
        newTask.date_limit = null;
    }
    
    if(newTask.date_limit){
        console.log("TASK DATE LIMIT CREATE", newTask.date_limit, new Date(newTask.date_limit).getTime(), new Date(2024, 1, 26).getTime())
        //Convert ISO Date to Time and then to System Date
        newTask.date_limit = new Date(new Date(newTask.date_limit).getTime())
    }

    newTask = Object.assign(task, newTask)

    return newTask
}



function addFiltersToQuery(query, filters){
    let finalQuery = query;
    let nextParam = 0;
    const paramNumbers = ["$2", "$3", "$4", "$5", "$6", "$7", "$8", "$9"]
    let finalFilters = {}

    if(filters.context_id){
        finalQuery = finalQuery.concat(" AND t.context_id = ")
        finalQuery = finalQuery.concat(paramNumbers[nextParam++]);
        finalFilters.context_id = filters.context_id;
    }

    if(filters.project_id){
        finalQuery = finalQuery.concat(" AND t.project_id = ")
        finalQuery = finalQuery.concat(paramNumbers[nextParam++]);
        finalFilters.project_id = filters.project_id;
    }

    if(filters.state){
        finalQuery = finalQuery.concat(" AND t.state = ")
        finalQuery = finalQuery.concat(paramNumbers[nextParam++]);
        finalFilters.state = filters.state;
    }

    if(filters.completed){
        finalQuery = finalQuery.concat(" AND t.completed = ")
        filters.completed = (/true/i).test(filters.completed);
        finalQuery = finalQuery.concat(paramNumbers[nextParam++]);
        finalFilters.completed = filters.completed;
    }

    if(filters.date_limit){
        if(filters.date_limit === '?'){
            finalQuery = finalQuery.concat(" AND t.date_limit is not null")
        }else if (filters.date_limit === 'null'){
            finalQuery = finalQuery.concat(" AND t.date_limit is null")
        }else if(Date.parse(filters.date_limit)){
            finalQuery = finalQuery.concat(" AND t.date_limit = ")
            finalQuery = finalQuery.concat(paramNumbers[nextParam++]);
            finalFilters.date_limit = new Date(filters.date_limit);
        }
    }

    if(filters.important_fixed){
        finalQuery = finalQuery.concat(" AND t.important_fixed = ")
        filters.important_fixed = (/true/i).test(filters.important_fixed);
        finalQuery = finalQuery.concat(paramNumbers[nextParam++]);
        finalFilters.important_fixed = filters.important_fixed;
    }

    if(filters.date_limit){
        finalQuery = finalQuery.concat(" order by t.date_limit");
    }

    return {query: finalQuery, values: Object.values(finalFilters)};
}

module.exports = taskService;