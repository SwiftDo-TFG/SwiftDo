const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService')

let task = {
    user_id: 1,
    context_id: 1,
    project_id: 1,
    title: "Crear tarea",
    description: "Intento de crear una nueva tarea para meter en la BD",
    state: "Initiate",
    verification_list: "",
    important_fixed: "true",
    date_added: Date.now(),
    date_completed: Date.now(),
    date_limit: Date.now(),
    date_changed: Date.now(),
    num_version: 1
}

router.post('/newTask', async (req, res)=>{
    try{
        // const data_task = req.body;
        const t = taskService.createTask(task);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

module.exports = router;