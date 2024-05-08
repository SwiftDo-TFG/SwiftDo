const express = require('express');
const router = express.Router();
const configService = require('../services/configService')

router.get('/test', async (req, res) =>{

  try{
    // const ok = await userService.register(userData);
    let urlCompleta = req.protocol + '://' + req.get('host')
    const info = {app: "session-gtd", url: urlCompleta}
    res.send(info);
  }catch (error){
    console.log('[Exception]:',error.message)
    res.sendStatus(500);
  }

})


router.post("/connect", async (req, res) =>{
    const client_info = req.body;
 
    try{
        //Crear sesion
        if(client_info.client_id && client_info.client_id.length > 0){
            client_info.redirect_uri = req.protocol + '://' + req.get('host') + "/"
            const config = await configService.createClient(client_info);
            res.send(config);
        }else{
            res.sendStatus(409);
        }
    }catch(error){
        console.log('[Exception]:',error.message)
        res.sendStatus(500);
    }
})

module.exports = router;
