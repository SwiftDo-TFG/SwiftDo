const express = require('express')
const router = express.Router()
const projectValidator = require('./validators/projectValidator');
const projectService = require('../services/projectService');
const checkValidations = require('./validators/validationUtils');

// Mostrar los proyectos asociados a un usuario
router.get('/', async (req, res) => {
    const user_id = res.locals.oauth.token.user.id;
    try {
        const projects = await projectService.showProjectsByUser(user_id);
        res.send(projects);
    }
    catch (e) {
        console.log('[Exception]: ', e.message)
        res.status(500).send({ error: e.message })
    }
})

// Creacion de un proyecto
router.post('/', projectValidator.validateCreate(), checkValidations, async (req, res) => {
    try {
        const project_data = req.body;
        const user_id = res.locals.oauth.token.user.id;
        project_data.user_id = user_id;

        const project = await projectService.createProject(project_data);
        res.send(project)
    }
    catch (e) {
        console.log('[Exception]: ', e.message)
        res.status(400).send({ error: e.message })
    }
})


// Completar un proyecto
router.post('/:id/complete', checkValidations, async (req, res) => {
    try {
        const project_id = req.params.id;
        const user_id = res.locals.oauth.token.user.id;
        const resProject = await projectService.completeProject(project_id, user_id);
        res.send({project_id: resProject})
    }
    catch (error) {
        console.error("[Exception]: ", error.message)
        res.status(404).send({ error: error.message });
    }
})

// Mostrar un proyecto dado y su progreso
router.get('/:id', checkValidations, async (req, res) => {
    try {
        const project_id = req.params.id;
        const project_data = req.body;
        const user_id = res.locals.oauth.token.user.id;
        project_data.user_id = user_id;
        const project = await projectService.showProjectContent(project_id)
        const tasks = await projectService.showTasksByProject(project_id)
        const progress = await projectService.showCompletedPercentage(project_id)
        res.send({ project: project, tasks: tasks, percentage: progress });
    }
    catch (error) {
        console.error("[Exception]: ", error.message)
        res.status(404).send({ error: error.message });
    }
})

// Actualizar los campos de un proyecto: 
router.post('/:id', projectValidator.validateModify(), checkValidations, async (req, res) => {
    try {
        const project_id = req.params.id;
        const project_data = req.body;
        const user_id = res.locals.oauth.token.user.id;
        project_data.user_id = user_id;
        const project = await projectService.modifyProject(project_id, project_data)
        res.send({ project_id: project });
    }
    catch (e) {
        console.log("[Exception]: ", e.message)
        res.status(404).send({ error: e.message })
    }
})

module.exports = router;