var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var fileupload = require('express-fileupload');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');



var session = require('express-session');
app.use(session({ secret: 'keyboard cat' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
// Pass the flash prototype; the templates will use it to get the messages
// (this works with redirect)
res.locals.flash = req.flash;
next();
});

app.use(fileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
//app.use(express.bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

console.log('A');
/*require('./models/passport')(passport);
require('./routes/index.js')(passport);
//***************************************************
/*
*/
//***************************************************
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var url = 'mongodb://localhost:27017/olx';
mongoose.connect(url);
mongoose.connection.on('connected', function(){
	console.log('connection established');
})

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);


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
