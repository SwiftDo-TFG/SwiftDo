if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './.env.local' });
}

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const oauthServer = require('./oauth/server.js')
const logger = require('morgan');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');



const port = process.env.PORT || 3000;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const taskRouter = require('./routes/task');
const tagsRouter = require('./routes/tags');
const authRouter = require('./routes/auth');
const projectRouter = require('./routes/project');
const contextRouter = require('./routes/context');
const configRouter = require('./routes/config')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/oauth', authRouter)
app.use('/', indexRouter);
app.use('/config', configRouter);
app.use('/user', usersRouter);
app.use('/task', oauthServer.authenticate(), taskRouter);
app.use('/tag', oauthServer.authenticate(), tagsRouter);
app.use('/project', oauthServer.authenticate(), projectRouter);
app.use('/context', oauthServer.authenticate(), contextRouter);
// Get secret.
app.get('/secret', oauthServer.authenticate(), function (req, res) {
  // Will require a valid access_token.
  res.send('Secret area, current user logged has id ' + res.locals.oauth.token.user.id);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.sendStatus(404);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)

  // render the error page
  res.sendStatus(err.status || 500);
});

if (process.env.NODE_ENV === 'production') {
  const hostname = process.env.HOSTNAME;
  const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${hostname}/privkey.pem`, 'utf8');
  const certificate = fs.readFileSync(`/etc/letsencrypt/live/${hostname}/cert.pem`, 'utf8');

  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  const httpServer = http.createServer(app);

  httpsServer.listen(port);
  httpsServer.listen(80);
  console.log(`App listening on port ${port}`)
}else{
  app.listen(port, function (err) {
    if (err) {
      console.log("Error openning server");
    } else {
      console.log(`App listening on port ${port}`)
    }
  })
}


module.exports = app;
