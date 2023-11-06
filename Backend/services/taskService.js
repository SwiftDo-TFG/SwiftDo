const db = require('../bd/pool.js')

const taskService = {}

taskService.createTask = async (task)=>{
    if(task.user_id !== null && task.title !== null && task.title.length !== 0){
        let res = await db.query("INSERT INTO tasks(user_id, context_id, project_id, title, description, state, verification_list, important_fixed, date_added, date_completed, date_limit, date_changed, num_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)",
            [task.user_id, task.context_id, task.project_id, task.title, task.description, task.state, task.verification_list, task.important_fixed, task.date_added, task.date_completed, task.date_limit, task.date_changed, task.num_version]);
        return res.rowCount === 1;
    }else{
        throw new Error("Tienen que estar rellenos los campos indicados");
    }
}

taskService.modificateTask = async (task)=>{
    if(task.user_id !== null && task.title !== null && task.title.length !== 0){
        let res = await db.query("UPDATE tasks SET user_id = $1, context_id = $2, project_id = $3, title = $4, description = $5, state = $6, verification_list = $7, important_fixed = $8, date_added = $9, date_completed = $10, date_limit = $11, date_changed = $12, num_version = $13 WHERE task_id = $14",
            [task.user_id, task.context_id, task.project_id, task.title, task.description, task.state, task.verification_list, task.important_fixed, task.date_added, task.date_completed, task.date_limit, task.date_changed, task.num_version, task.task_id]);
        if(res.rowCount !== 1){
            throw new Error('The task does not exist');
        }else{
            return res.rows[0];
        }
    }else{
        throw new Error("Tienen que estar rellenos los campos indicados");
    }

}

taskService.findTaskById = async (id)=>{
    const res = await db.query('SELECT * FROM tasks WHERE task_id = $1', [id])

    if(res.rows.length != 1){
        throw new Error('The task does not exist');
    }

    return res.rows[0];
}

taskService.findTaskByUserId = async (id)=>{
    const res = await db.query('SELECT * FROM tasks WHERE user_id = $1', [id])

    return res.rows;
}

module.exports = taskService;