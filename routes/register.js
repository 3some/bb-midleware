var express = require('express');
var router = express.Router();
var Odoo = require('odoo-xmlrpc');
var odoo = new Odoo({
    url: 'localhost',
    port: 8069,
    db: 'odoo',
    username: 'khacthanh234@gmail.com',
    password: 'khacthanh'
});


router.get('/', function(req, res) {
  res.render('register', {
    title: 'express-hbs example'
  });
});


router.post('/', function(req, res) {
	console.error("vao day roi", req.body);
	let username = req.body.username;
	let password = req.body.password;
	odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push({'name': req.body.name, 'login': username,
    'company_ids':[1], 'company_id':1, 'password': password});
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.users', 'create', params, function (err, value) {
      if (err) {
         console.log(err);
         return res.render('index', {
            title: 'express-hbs example',
            err : "Có lỗi xảy ra"
         });
      }
      res.redirect('/index');
      console.log('Result: ', value);
    });
	});
});


module.exports = router;
