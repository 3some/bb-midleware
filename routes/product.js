var express = require('express');
var router = express.Router();
var Odoo = require('odoo-xmlrpc');
var config = require('../config/login');
let odooObject = {
    url: 'localhost',
    port: 8069,
    db: config.database,
   	username: 'khacthanh234@gmail.com',
    password: 'khacthanh'
};

/*

router.get('/', function(req, res) {
	console.error("vao day roi",req.session);
	let username = req.session.username;
	let password = req.session.password;
	odooObject.password = password;
	odooObject.username = username;
  if(!username) {
    return res.redirect('/index')
  }
  console.error("username username", username);
  console.error("passwords password", password);
	var odoo = new Odoo(odooObject);

	odoo.connect(function (err) {
    if (err) {
    	console.log(err);
    	return res.render('index', {
    	    title: 'express-hbs example',
    	    err: "Login Error! Try again!"
    	  });
    }

    console.log('Connected to Odoo server.');

    var inParams = [];
    inParams.push([]);
    inParams.push([]);
   // inParams.push(['name','x_location']);

    var params = [];
    params.push(inParams);

    odoo.execute_kw('product.template', 'search_read', params, function (err, value) {
      if (err) { return res.json({err : true, data: err}); }
      	// console.error(value);
      res.json({ err: false, data: value});
        // res.render('product', {
        //     title: 'express-hbs example',
        //     err: '',
        //     data: value
        //  });
    });
  });

});

*/

router.get('/', function(req, res) {
    // console.error("vao day roi",req.session);
    // let username = req.session.username;
    // let password = req.session.password;
    // odooObject.password = password;
    // odooObject.username = username;
 //  if(!username) {
 //    return res.redirect('/index')
 //  }
 //  console.error("username username", username);
 //  console.error("passwords password", password);
    var odoo = new Odoo(odooObject);

    odoo.connect(function (err) {
    if (err) { 
      console.log(err);
      return res.render('index', {
        title: 'express-hbs example',
        err: "Login Error! Try again!"
      });
    }

    console.log('Connected to Odoo server.');

    var inParams = [];
    inParams.push([]);
    inParams.push([]);
   // inParams.push(['name','x_location']);

    var params = [];
    params.push(inParams);

    odoo.execute_kw('product.template', 'search_read', params, function (err, value) {
      if (err) { return res.json({err : true, data: err}); }
        // console.error(value);
      res.json({ err: false, data: value});
        // res.render('product', {
        //     title: 'express-hbs example',
        //     err: '',
        //     data: value
        //  });
    });
  });
    
});


module.exports = router;
