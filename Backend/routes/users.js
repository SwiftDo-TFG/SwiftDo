const express = require('express');
const router = express.Router();
const userService = require('../services/userService')


router.post('/register', async (req, res) =>{
  const userData = req.body;

  try{
    const ok = await userService.register(userData);
    res.send(ok);
  }catch (error){
    console.log('[Exception]:',error.message)
    res.sendStatus(500);
  }

})


router.post('/login', async (req, res) =>{
  const userData = req.body;

  try{
    const ok = await userService.login(userData);
    res.send(ok);
  }catch (error){
    console.log('[Exception]:',error.message)
    res.sendStatus(500);
  }

})

router.get('/:id', async (req, res)=>{
  const id = req.params.id;

  try {
    const user = await userService.findUserById(id);
    res.send(user);
  } catch (error) {
    console.log('[Exception]:',error.message)
    res.sendStatus(404);
  }
})

module.exports = router;
