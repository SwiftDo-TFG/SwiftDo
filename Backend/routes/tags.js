const express = require('express');
const router = express.Router();
const tagService = require('../services/tagService')

router.post('/newtag', async (req, res)=>{
    try{
        const tag = req.body.name;
        const t = tagService.createTag(tag);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

router.post('/findTag', async (req, res)=>{
  try {
    const tag = req.body.name;
    const t = await tagService.findTag(tag);
    res.send(t);
  } catch (error) {
    console.log('[Exception]:',error.message)
    res.sendStatus(404);
  }
})
  
  module.exports = router;
  