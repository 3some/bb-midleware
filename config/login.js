const config = {
  "cookieSecret":"dfkjdlsfjljklsdfj",
  "facebook":{
    "app_id":"304576920003532",
      "app_secret":"e1edb3afaa5335eaec2629a2f0cad95f",
      "callback":this.host +"/auth/facebook/callback"
  },
  host: 'http://localhost:3001',
  // host: 'http://taytrang.vn:3001',
  database: "odoo",
  // database: "odoo",


}

module.exports = config;