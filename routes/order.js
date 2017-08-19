var express = require('express');
var router = express.Router();
var Odoo = require('odoo-xmlrpc');
var config = require('../config/login');


let odooObject2 = {
  url: 'localhost',
  port: 8069,
  db: config.database,
  username: 'khacthanh234@gmail.com',
  password: 'khacthanh'
};



router.post('/', function (req, res) {
  console.error("vao day ro i2 222222222", req.body.data);
  let line_vals = req.body.data;
  var odoo = new Odoo(odooObject2);
  odoo.connect(function (err) {
    if (err) {
      return console.log(err);
    }
    odoo.execute_kw('sale.order', 'create', [line_vals], function (err, value) {
      if (err) {
        console.log("err err err", err);
        return res.json({err: true, data: err});
      }
      //console.error(value);
      res.json({err: false, data: "Thành công! Vào admin để xem id" + value, value: value});
    });
  });
})


module.exports = router;
