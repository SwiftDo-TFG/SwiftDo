const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService')
const taskValidator = require('./validators/taskValidator')
const checkValidations = require('./validators/validationUtils');
const userService = require('../services/userService');
const projectService = require('../services/projectService');
const contextService = require('../services/contextService');



router.get('/', async (req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  const filters = req.query;
  console.log("[TASK FIND BY ID] The filters", filters)

  try {
    let task;

    if (Object.keys(filters).length === 0) {
      task = await taskService.findTaskByUserId(user_id);
    } else {
      task = await taskService.findTasksByFilters(user_id, filters)
    }

    res.send(task);
  } catch (error) {
    console.log('[Exception]:', error.message)
    res.sendStatus(404);
  }
})

router.post('/', taskValidator.validateCreate(), checkValidations, async (req, res) => {
  try {
    const data_task = req.body;
    const user_id = res.locals.oauth.token.user.id;
    data_task.user_id = user_id;

    const t = await taskService.createTask(data_task);
    res.send({ task_id: t });
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409);
  }
})

router.post('/movelist', taskValidator.validateMoveList(), checkValidations, async (req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  const list_ids = req.body.list_ids;
  const state = req.body.state;

  try {
    const t = await taskService.moveList(user_id, list_ids, state);
    res.send(t);
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409)
  }
})

router.post('/completelist', taskValidator.validateCompleteList(), checkValidations, async (req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  const list_ids = req.body.list_ids;
  const completed = req.body.completed;

  try {
    const t = await taskService.completeList(user_id, list_ids, completed);
    res.send(t);
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409)
  }
})

router.post('/addTag', async (req, res) => {
  const tag = req.body.tag;
  const id = req.body.task_id;
  try {
    const t = await taskService.addTag(id, tag);
    res.send(t);
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409)
  }
})

router.get('/:id/tags', async (req, res) => {
  const id = req.params.id;
  try {
    const t = await taskService.findTags(id);
    res.send(t);
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409)
  }
})

router.post('/synchronize', async (req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  const task_list = req.body.task_list
  console.log("[SYNCHRONIZE]", task_list);

  try {
    const task = await taskService.synchronizeOffline(task_list, user_id);
    res.send(task);
  } catch (error) {
    console.log('[Exception]:', error.message)
    res.sendStatus(404);
  }
})

router.post('/:id', taskValidator.validateModify(), checkValidations, async (req, res) => {
  try {
    const task_id = req.params.id;
    const data_task = req.body;
    const user_id = res.locals.oauth.token.user.id;
    data_task.user_id = user_id;
    const t = await taskService.modifyTask(task_id, data_task);
    res.send({ task_id: t });
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409);
  }
})


router.get('/newinfo', async (req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  const filters = req.query;

  try {

    const userInfo = await userService.findUserById(user_id)
    const taskInfo = await taskService.newgetInfo(user_id);
    const projects = await projectService.showProjectsByUser(user_id)
    const contexts = await contextService.showContextsByUser(user_id);
    res.send({ userName: userInfo.name, tasksInfo: taskInfo, projects: projects, contexts: contexts })
  } catch (error) {
    console.log('[Exception]:', error.message)
    res.sendStatus(404);
  }
})

router.get('/info', async (req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  const filters = req.query;

  try {

    const userInfo = await userService.findUserById(user_id)
    const task_inbox = await taskService.getInfo(user_id, 1)
    const task_ca = await taskService.getInfo(user_id, 2)
    const task_prog = await taskService.getInfo(user_id, 3)
    const task_arch = await taskService.getInfo(user_id, 4)

    res.send({ userName: userInfo.name, task_inbox: task_inbox, task_ca: task_ca, task_prog: task_prog, task_arch: task_arch });
  } catch (error) {
    console.log('[Exception]:', error.message)
    res.sendStatus(404);
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user_id = res.locals.oauth.token.user.id;
  console.log(id);

  try {
    const task = await taskService.findTaskById(id, user_id);
    res.send(task);
  } catch (error) {
    console.log('[Exception]:', error.message)
    res.sendStatus(404);
  }
})


module.exports = router;
