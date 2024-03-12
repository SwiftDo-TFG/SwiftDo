const express = require('express');
const router = express.Router();
const tagService = require('../services/tagService')
const tagValidator = require('./validators/tagValidator')
const checkValidations = require('./validators/validationUtils')

router.post('/', tagValidator.validateCreate(), checkValidations, async (req, res)=>{
    try{
        const tag = req.body.name;
        const t = tagService.createTag(tag);
        res.send(t);
    }catch(err){
        console.log('[Exception]:',err.message)
        res.sendStatus(404);
    }
})

router.get('/', async (req, res)=>{
  try {
    const tag = req.query.name;
    const t = await tagService.findTag(tag);
    res.send(t);
  } catch (error) {
    console.log('[Exception]:',error.message)
    res.sendStatus(404);
  }
})

router.get('/getTags', async (req, res) => {
  try {
    const user_id = res.locals.oauth.token.user.id;

    const tags = await tagService.getAllTagsByUser(user_id);
    res.send(tags);
  } catch (err) {
    console.log('[Exception]:', err.message)
    res.sendStatus(409);
  }
})
  
  module.exports = router;
  