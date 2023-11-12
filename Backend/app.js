const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const oauthServer = require('./oauth/server.js')
const logger = require('morgan');
const port = 3000;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const taskRouter = require('./routes/task');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/oauth', authRouter)
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/task', taskRouter);

// Get secret.
app.get('/secret', oauthServer.authenticate(), function(req, res) {
  // Will require a valid access_token.
  res.send('Secret area');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendStatus(404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)

  // render the error page
  res.sendStatus(err.status || 500);
});

app.listen(port, function(err){
  if(err){
    console.log("Error openning server");
  }else{
    console.log(`App listening on port ${port}`)
  }
})

module.exports = app;
