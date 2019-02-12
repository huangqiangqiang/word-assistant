require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var jwt = require('express-jwt');
var favicon = require('serve-favicon');
const mongo = require('./utils/mongo');

var indexRouter = require('./routes/index');
var translateRouter = require('./routes/translate');
var loginRouter = require('./routes/login');
var historyRouter = require('./routes/history');
var detectRouter = require('./routes/detect');

var app = express();

// 链接mongodb
mongo();

// cors
app.use(cors());

// 浏览器会自动发起favicon.ico请求
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// token 
app.use(jwt({ secret: 'qwer1qaz'}).unless({path: [
  '/login'
]}));

app.use('/', indexRouter);
app.use('/translate', translateRouter);
app.use('/history', historyRouter);
app.use('/login', loginRouter);
app.use('/detect', detectRouter);

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
  res.send('服务器异常！');
});

module.exports = app;
