var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var fs = require('fs');
var fp = require('path');



//var Odoo = require('node-odoo');
var Odoo = require('odoo-xmlrpc');
var odoo = new Odoo({
    url: 'localhost',
    port: 8069,
    db: 'odoo',
    username: 'khacthanh234@gmail.com',
    password: 'khacthanh'
});


var hbs = require('express-hbs');
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,   
    maxAge:  1800000
  }
}))
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
   if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  } else {
    return next();
  }
});


const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use('/index', indexRouter);
app.use('/register', registerRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);


app.use('/get-product', (req, res) => {
  odoo.connect(function (err) {
  if (err) { return console.log("errorr laaaaaa",err); }
    var inParams = [];

    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([]);
    //inParams.push(['name','x_location']);
    
    inParams.push([]);
    var params = [];
    params.push(inParams);

    odoo.execute_kw('pos.template', 'search_read', params, function (err, value) {
      if (err) { return res.json({err : true, data: err}); }
      res.json({err : false, data : value});
    });
  });
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
