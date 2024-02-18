const db = require('../bd/pool.js')

const projectService = {}

// CREATE

projectService.createProject = async (project_data) =>{
    const project = completeDefValues(project_data)

    if(project.title.length === 0){
        throw new Error("El proyecto se ha intentado crear sin titulo")
    }
 
    let res = await db.query("INSERT INTO projects(title, description, user_id, completed, date_added, date_changed, date_completed, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING project_id", 
        [project.title, project.description, project.user_id, project.completed, project.date_added, project.date_changed, project.date_completed, project.color])
    
    return res.rowCount === 1 ? res.rows[0] : -1
}

// READ

projectService.showProjectsByUser = async (user_id) => {
    
    const res = await db.query("SELECT * FROM projects WHERE user_id = $1 AND completed is not true", [user_id]);
    return res.rows;
}

projectService.showProjectContent = async (project_id) => {
    
    const res = await db.query('SELECT * FROM projects WHERE project_id = $1 AND completed is not true', [project_id])
    if(res.rowCount !== 1){
        throw new Error("The project does not exist")
    }
    return res.rows[0];
}

projectService.showTasksByProject = async (project_id) => {
    
    const res = await db.query('SELECT * FROM tasks WHERE project_id = $1 AND completed is not true', [project_id])
    
    return res.rows;
}

projectService.showCompletedPercentage =  async (project_id) =>{
    const consulta = `SELECT
                        (SELECT COUNT(*) FROM tasks WHERE project_id = $1 AND completed is true) AS completed_tasks,
                        (SELECT COUNT(*) FROM tasks WHERE project_id = $1) AS total_tasks`
    const res = await db.query(consulta, [project_id]);
    const {completed_tasks, total_tasks} = res.rows[0];
    return completed_tasks/total_tasks * 100;
}


// UPDATE

projectService.modifyProject = async (project_id, project) =>{

    const client = await db.getClient();
    let project_notUpdated = await client.query('SELECT * FROM projects WHERE project_id = $1',[project_id]);
    
    if(project_notUpdated.rows.length !== 1){
        throw new Error("The project does not exist")
    }
    
    project = updateProjectDefValues(project_notUpdated.rows[0], project);
    
    let project_updated = await db.query("UPDATE projects SET title = $1, description = $2, completed = $3, date_changed = $4, date_completed = $5, num_version = $6 WHERE project_id = $7 RETURNING project_id", 
        [project.title, project.description, project.completed, project.date_changed, project.date_completed, project.num_version, project_id])
    
    if(project_updated.rows.length !== 1){
        throw new Error("The project does not exist")
    }
    if(client){
        client.release()
        return project_updated.rows[0].project_id;
    }
    
    
}

function completeDefValues(project){
    if(!project.user_id){
        throw new Error("Invalid project Data")
    }

    project.completed = false;
    project.date_added = new Date();
    project.date_changed = new Date();
    project.num_version = 1;
    project.percentage = 0;
    return project
}

function updateProjectDefValues(project, newProject){
    
    project.date_changed = new Date();
    project.num_version = parseInt(project.num_version)
    project.num_version += 1

    if(newProject.completed){
        project.completed = true;
        project.date_completed = new Date();
    }

    newProject = Object.assign(project, newProject)
    
    return newProject;
}

module.exports = projectService;