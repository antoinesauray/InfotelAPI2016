var express = require('express');
var crypto = require('crypto');
var users = require('../models').users;

var router  = express.Router();
module.exports = router;

router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
})

.get('/', function (req, res) {
        console.log(req);
        res.send("Some stats informations");
})

.get('/add', function (req, res) {
    var data = req.query;

    var hashPassword = crypto.createHash("sha256").update(data.password, "utf8").digest("base64");

    users.build(
      {
         firstname: data.firstname,
         lastname: data.lastname,
         mail: data.mail,
         password: hashPassword
      }).save()
      .then(function(user) {
          res.json({
             message: 'User created',
             user: user
          });
      }, function(err) {
          res.json({
             message: 'Failed to create user',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    users.findAll().then(function(users) {
      res.json({ users: users});
    })
});

router.route('/:user_id').get(function(req, res) {
  	users.find({
        where: {
          id: req.params.user_id
        }
    }).then(function(user) {
          res.json({
             message: 'User found',
             user: user
          });
    }, function(err) {
          res.json({
             message: 'Faild to found user',
             error: err
          });
    });
})
