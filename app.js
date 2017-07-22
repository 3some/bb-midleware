var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var fs = require('fs');
var jwt = require('jsonwebtoken');

var Odoo = require('odoo-xmlrpc');
var odoo = new Odoo({
    url: 'localhost',
    port: 8069,
    db: 'odoo',
    username: 'khacthanh234@gmail.com',
    password: 'khacthanh'
});

var credentials = require('./config/login');

var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboardcatsss',
  cookie: { secure: false,
    maxAge:  1800000
  }
}))

//app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ["email"] }));

app.get('/auth/facebooks/callback', passport.authenticate('facebook',
  { failureRedirect: '/auth/facebook', successRedirect: '/profile',}));

passport.use(new FacebookStrategy({
    clientID: credentials.facebook.app_id,
    clientSecret: credentials.facebook.app_secret,
    callbackURL: 'http://localhost:3000/auth/facebooks/callback',
    profileFields:['id','emails', 'displayName']
  }, function(accessToken, refreshToken, profile, done) {
    console.error("me me me me meme ", profile);
    profile.tokenUser = jwt.sign({ id: profile.id, iat: Math.floor(Date.now() / 1000)- 30 }, 'sggdsdjh');

    var inParams = [];
    inParams.push([['login', '=', profile.id]]);
    inParams.push(['name']);
    inParams.push(0);  //offset
    inParams.push(1);  //Limit
    var params = [];
    params.push(inParams);
    odoo.connect(function (err) {
      if (err) { return console.log(err); }
      odoo.execute_kw('res.users', 'search_read', params, function (err, value) {
        if (err) {
          console.log("errerrerrerr", err);
          return done(err, profile);
        }

        if(value.length < 1) {
          var inParams = [];
          inParams.push({'name': profile.displayName, 'login': profile.id,
            'company_ids':[1], 'company_id':1});
          var params = [];
          params.push(inParams);
          odoo.execute_kw('res.users', 'create', params, function (err, value) {
            if (err) {
              console.log('res.users',err);
              return done(err, profile);
            }
            else {
              console.log('Result: ', value);
              profile.userIdOdoo = value[0].id;
              return done(null, profile);
            }
          });
        } else {
          profile.userIdOdoo = value[0].id;
          return done(null, profile);
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use('/profile', function(req, res) {
  res.redirect(`http://localhost:3001/getToken?token=${req.user.tokenUser}&username=${req.user.displayName}&userIdOdoo=${req.user.userIdOdoo}`);
  res.json({user: req.user });
});
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
