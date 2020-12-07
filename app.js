require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
require('./app_api/models/db');
require('./app_api/config/passport');
//var indexRouter = require('./app_client/routes/index');
//var usersRouter = require('./app_client/routes/users');
var routesApi = require ('./app_api/routes/index');

var app = express();

// view engine setup
app.set('port', 80);
//app.set('views', path.join(__dirname, './app_client'));
//app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/app_client/lib'));
app.use('/js', express.static(__dirname + '/app_client/'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/css')); // redirect CSS bootstrap 
app.use('/css', express.static(__dirname + '/public/stylesheets'));
app.use('/webfonts', express.static(__dirname + '/public/fonts/webfonts/')); 
app.use('/nav', express.static(__dirname + '/app_client/common/nav')); 
app.use('/auth', express.static(__dirname + '/app_client/common/auth'));

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api', routesApi);

app.use(function(req, res) {
    res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
