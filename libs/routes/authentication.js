var express = require('express');
var crypto = require('crypto');
var jwt    = require('jsonwebtoken');
var users = require('../models').users;
var config    = require(__dirname + '/..\\config\\config.json')["token"];
var router  = express.Router();
module.exports = router;

router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
})

.get('/', function (req, res) {
  var data = req.query;
  var hashPassword = crypto.createHash("sha256").update(data.password, "utf8").digest("base64");

  users.find({
      where: {
        mail: data.mail,
        password: hashPassword
      }
  }).then(function(user) {
        if(user != null){

            // token creation
            var token = jwt.sign({id: user.id}, config.secret, {expiresIn: 1440});
            res.json({
               message: 'User found',
               user: user,
               token: token
            });

        } else {
            res.json({
               message: 'User not found',
               error: 'User not found'
            });
        }
  }, function(err) {
        res.json({
           message: 'Faild to found user',
           error: err
        });
  });
})
