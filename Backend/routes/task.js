const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService')


router.get('/', async (req, res)=>{
  const user_id = res.locals.oauth.token.user.id;

  try {
    const task = await taskService.findTaskByUserId(user_id);
    res.send(task);
  } catch (error) {
    console.log('[Exception]:',error.message)
    res.sendStatus(404);
  }
})

router.post('/', async (req, res)=>{
    try{
        const data_task = req.body;
        const user_id = res.locals.oauth.token.user.id;
        data_task.user_id = user_id;
        
        const t = await taskService.createTask(data_task);
        res.send({task_id: t});
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(409);
    }
})

router.post('/:id', async (req, res)=>{
  try{
      const task_id = req.params.id;
      const data_task = req.body;
      const user_id = res.locals.oauth.token.user.id;
      data_task.user_id = user_id;
      const t = await taskService.modifyTask(task_id, data_task);
      res.send({task_id: t});
  }catch(err){
      console.log('[Exception]:',err.message)
      res.sendStatus(409);
  }
})

router.get('/:id', async (req, res)=>{
    const id = req.params.id;
    console.log(id);
  
    try {
      const task = await taskService.findTaskById(id);
      res.send(task);
    } catch (error) {
      console.log('[Exception]:',error.message)
      res.sendStatus(404);
    }
  })
  
  module.exports = router;
  