var express = require('express');
var router = express.Router();
var Odoo = require('odoo-xmlrpc');
let odooObject2 = {
  url: 'localhost',
  port: 8069,
  db: 'odoo',
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


/*
router.get('/', function (req, res) {
  console.error("vao day ro i2 222222222");
  let username = req.session.username;
  let password = req.session.password;
  //odooObject.password = password;
  //odooObject.username = username;

  if (!username) {
    return res.redirect('/index')
  }
  console.error("username username", username);
  console.error("passwords password", password);
  var odoo = new Odoo(odooObject2);

  odoo.connect(function (err) {
    if (err) {
      console.log(err);
      return res.render('index', {
        title: 'express-hbs example',
        err: "Login Error! Try again!"
      });
    }

    console.log('Connected to Odoo server.');

    let pricePro = req.query.price;
    let levelUser = req.query.level;

    let line_vals = [{
      "partner_id": req.session.userId,
      "partner_invoice_id": req.session.userId,
      "partner_shipping_id": req.session.userId,
      "date_order": "2017-06-30 15:47:35",
      "validity_date": "2017-07-01",
      "pricelist_id": 1,
      "payment_term_id": 2,
      "order_line": [[0, false, {
        "qty_delivered": 0,
        "sequence": 10,
        "customer_lead": 0,
        "price_unit": pricePro,
        "product_uom_qty": 1,
        "discount": req.query.discount,
        "state": "draft",
        "qty_delivered_updateable": true,
        "invoice_status": "no",
        "product_id": 5,
        "layout_category_id": false,
        "name": req.query.name,
        "product_uom": 1,
        "analytic_tag_ids": [],
        "route_id": false,
        "tax_id": [[6, false, [6]]],
        "procurement_ids": []
      }]],
      "note": false,
      "warehouse_id": 1,
      "incoterm": false,
      "picking_policy": "direct",
      "user_id": 1,
      "tag_ids": [],
      "team_id": 1,
      "client_order_ref": false,
      "company_id": 1,
      "project_id": false,
      "fiscal_position_id": false,
      "origin": false,
      "campaign_id": false,
      "medium_id": false,
      "source_id": false,
      "opportunity_id": false,
      "message_follower_ids": false,
      "message_ids": false
    }]


    odoo.execute_kw('sale.order', 'create', [line_vals], function (err, value) {
      if (err) {
        return res.json({err: true, data: err});
      }
      //console.error(value);
      res.json({ err: false, data: "Thành công! Vào admin để xem id" + value, value: value });
    });
  });

});

*/

module.exports = router;
