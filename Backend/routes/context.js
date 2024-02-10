const express = require('express');
const router = express.Router();
const contextService = require('../services/contextService')
const contextValidator = require('./validators/contextValidator')
const checkValidations = require('./validators/validationUtils')


router.post('/', contextValidator.validateCreate(), checkValidations, async (req, res)=>{//create
    try{
        const context = req.body;
        const t = contextService.createContext(context);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

// Mostrar los contexts asociados a un usuario
router.get('/', async(req, res) => {
  const user_id = res.locals.oauth.token.user.id;
  try{
      const contexts = await contextService.showContextsByUser(user_id);
      res.send(contexts);
  }
  catch(e){
      console.log('[Exception]: ', e.message)
      res.status(500).send({ error: e.message })
  }
})

router.delete('/:id', async (req, res)=>{//delete
    try{
        const id = req.params.id;
        const t = contextService.deleteContext(id);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

router.post('/:id', async (req, res)=>{//modify
    try{
        const context = req.body;
        const id=req.params.id;
        const t = contextService.modifyContext(context, id);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
  })

router.get('/:id', async (req, res)=>{//find
  try {
    const context = req.params.id;
    const t = await contextService.findContext(context);
    res.send(t);
  } catch (error) {
    console.log('[Exception]:',error.message)
    res.sendStatus(404);
  }
})
  
  module.exports = router;
  