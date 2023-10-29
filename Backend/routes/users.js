const express = require('express');
const router = express.Router();
const userService = require('../services/userService')


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
