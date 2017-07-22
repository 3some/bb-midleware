const config = {
  "cookieSecret":"dfkjdlsfjljklsdfj",
  "facebook":{
  "app_id":"304576920003532",
    "app_secret":"e1edb3afaa5335eaec2629a2f0cad95f",
    "callback":"http://localhost:3000/auth/facebook/callback"
},
  "twitter":{
  "consumer_key":"akeyishere",
    "consumer_secret":"mysecretisbetterthanyoursecret",
    "callback":"http://localhost:3000/auth/twitter/callback"
},
  "mongo":{
  "development":{
    "connectionString":"mongodb://localhost/foo"
  },
  "production":{}
}
}

module.exports = config;