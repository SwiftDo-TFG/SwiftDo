const db = require('../bd/pool.js')

const taskService = {}

taskService.createTask = async (task)=>{
    await db.query('SELECT user_id FROM tasks WHERE user_id = $1', [task.user_id], (err, res)=>{
        if(err){
            throw new Error('Connection error with the BD')
        }
        else{
            if(res.rows.length != 0){
                throw new Error('The task just exist');
            }
            else{
                db.query("INSERT INTO tasks(user_id, context_id, project_id, title, description, state, verification_list, important_fixed, date_added, date_completed, date_limit, date_changed, num_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)", [task.user_id, task.context_id, task.project_id, task.title, task.description, task.state, task.verification_list, task.important_fixed, task.date_added, task.date_completed, task.date_limit, date_changed, num_version], (err, resultTask)=>{
                    if(err){
                        throw Error("Error creating the task");
                    }
                    else{
                        return resultTask.insertId;
                    }
                });
            }
        }
    })

}

taskService.modificateTask = async (task)=>{
    await db.query("", [], (err, res)=>{

    })
}

module.exports = taskService;