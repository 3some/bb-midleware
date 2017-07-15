var express = require('express');
var router = express.Router();
var Odoo = require('odoo-xmlrpc');
let odooObject = {
    url: 'localhost', //ip server odoo
    port: 8069,
    db: 'odoo',
   	//username: 'thanh12@gmail.com',
    //password: '123'
};

let odooObject2 = {
  url: 'localhost',
  port: 8069,
  db: 'odoo',
  username: 'khacthanh234@gmail.com',
  password: 'khacthanh'
};


router.get('/', function(req, res) {
  res.render('index', {
    title: 'express-hbs example',
    err: ''
  });
});

 var sessionAcc ;
router.post('/', function(req, res) {
	console.error("vao day roi",req.body);
	let username = req.body.username;
	let password = req.body.password;
	odooObject.password = password;
	odooObject.username = username;
	console.log("username la ", username);
	var odoo = new Odoo(odooObject);

	odoo.connect(function (err, data) {
    if (err) { 
    	console.log(err);  
    	return res.render('index', {
		    title: 'express-hbs example',
		    err: "Login Error! Try again!"
		  });
    }

    var inParams = [];
    inParams.push([['login', '=', username]]);
    inParams.push(['name']);
    inParams.push(0);  //offset
    inParams.push(1);  //Limit
    var params = [];
    params.push(inParams);
    var odoo2= new Odoo(odooObject2);
    odoo2.connect(function (err) {
      if (err) {
        console.log(err);
        return res.render('index', {
          title: 'express-hbs example',
          err: "Login Error! Try again!"
        });
      }
      odoo2.execute_kw('res.users', 'search_read', params, function (err, value) {
        if (err) {
          console.log("errerrerrerr", err);
          return res.render('index', {
            title: 'express-hbs example',
            err: "Login Error! Try again!"
          });
        }

        console.error("value2value2 la", value);
        sessionAcc = req.session;
        sessionAcc.username = username;
        sessionAcc.password = password;
        sessionAcc.userId = value[0].id;
        console.error("userId userId userId", value[0].id)
        res.redirect('/product');
      });
    });
	});
});





module.exports = router;
