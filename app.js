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
var config = require('./config/login');

var Odoo = require('odoo-xmlrpc');
var odoo = new Odoo({
    url: 'localhost',
    port: 8069,
    db: config.database,
    username: 'khacthanh234@gmail.com',
    password: 'khacthanh'
});


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
  { failureRedirect: '/auth/facebook', successRedirect: '/profile'}));

passport.use(new FacebookStrategy({
    clientID: config.facebook.app_id,
    clientSecret: config.facebook.app_secret,
    callbackURL: '/auth/facebooks/callback',
    profileFields:['id','emails', 'displayName']
  }, function(accessToken, refreshToken, profile, done) {
    console.error("me me me me meme ", profile);
    profile.tokenUser = jwt.sign({ id: profile.id, iat: Math.floor(Date.now() / 1000)- 30 }, 'sggdsdjh');

    var inParams = [];
    inParams.push([['x_fbId', '=', profile.id]]);
    inParams.push(['name', 'x_fbId', 'user_id']);
    inParams.push(0);  //offset
    inParams.push(1);  //Limit
    var params = [];
    params.push(inParams);
    odoo.connect(function (err) {
      if (err) { return console.log(err); }
      odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
        if (err) {
          console.log("errerrerrerr", err);
          return done(err, profile);
        }

        if(value.length < 1) {
          var inParams = [];
          inParams.push({ 'name': profile.displayName, 'x_fbId': profile.id, 'active' : false });
          var params = [];
          params.push(inParams);
          odoo.execute_kw('res.partner', 'create', params, function (err, value) {
            if (err) {
              console.log('res.partner',err);
              return done(err, profile);
            }
            else {
              console.log('Result: ', value);
              profile.userIdOdoo = value;
              profile.userIdSale = 1;
              return done(null, profile);
            }
          });
        } else {
          console.error("value[0] value[0]", value[0]);
          profile.userIdOdoo = value[0].id;
          profile.userIdSale = value[0].user_id;
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
  res.redirect(`${config.host}/getToken?token=${req.user.tokenUser}
    &username=${req.user.displayName}&userIdOdoo=${req.user.userIdOdoo}&userIdSale=${req.user.userIdSale}`);
  res.json({user: req.user });
});
app.use('/index', indexRouter);
app.use('/register', registerRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);


app.use('/get-product', function(req, res) {
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
