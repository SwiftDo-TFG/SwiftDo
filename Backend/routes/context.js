const express = require('express');
const router = express.Router();
const contextService = require('../services/contextService')

router.post('/', async (req, res)=>{//create
    try{
        const context = req.body.name;
        const t = contextService.createContext(context);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

router.post('/:id', async (req, res)=>{//delete
    try{
        const context = req.body.name;
        const t = contextService.deleteContext(context);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

router.post('/:id', async (req, res)=>{//modify
    try{
        const context = req.body;
        const t = taskService.modifyContext(context);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
  })

router.get('/:id', async (req, res)=>{
  try {
    const context = req.body.name;
    const t = await contextService.findContext(context);
    res.send(t);
  } catch (error) {
    console.log('[Exception]:',error.message)
    res.sendStatus(404);
  }
})
  
  module.exports = router;
  