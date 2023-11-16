const path = require('path') // has path and __dirname
const express = require('express')
const oauthServer = require('../oauth/server.js')
const userService = require('../services/userService.js')
var	Request = oauthServer.Request;
var	Response = oauthServer.Response;

// const DebugControl = require('../utilities/debug.js')


const router = express.Router() // Instantiate a new router

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html')

router.get('/', (req, res) => {  // send back a simple form for the oauth
    res.sendFile(filePath)
})


router.post('/authorize', async (req, res, next) => {
    console.log('Initial User Authentication')
    const userData = { email: req.body.email, password: req.body.password };
    
    const userid = await userService.login(userData);
    
    if(userid !== -1){
        req.body.user = { user: userid }
        return next()
    }
   
    return res.redirect(`/oauth?success=false`)
}, (req, res, next) => { // sends us to our redirect with an authorization code in our url
    console.log('Authorization')
    return next()
}, oauthServer.authorize({
    authenticateHandler: {
      handle: req => {
        return req.body.user
      }
    }
  }))

router.post('/token', (req, res, next) => {
    console.log('Token')
    next()
}, oauthServer.token({
    requireClientAuthentication: { // whether client needs to provide client_secret
        // 'authorization_code': false,
    },
}))  // Sends back token


module.exports = router