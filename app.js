var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs=require('ejs');
var session = require('express-session');

//TODO路由
var indexRouter = require('./routes/index');
var detailRouter= require('./routes/watermark')

var app = express();

app.use('/',express.static('./'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('details',path.join(__dirname,'views/details'))

app.set('view engine', 'html');
//TODOnodejs模板引擎
app.engine('html',ejs.__express);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'secret',
  name:'username',
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:60000}
}))
app.use('/', indexRouter);
app.use('/watermark',detailRouter);

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
