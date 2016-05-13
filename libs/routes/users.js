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

.post('/add', function (req, res) {
    var data = req.body;

    var hashPassword = crypto.createHash("sha256").update(data.password, "utf8").digest("base64");

    users.build(
      {
         firstname: data.firstname,
         lastname: data.lastname,
         mail: data.mail,
         password: hashPassword
      }).save()
      .then(function(user) {
          res.status(201).send({
             message: 'User created',
             user: user
          });
      }, function(err) {
          res.status(409).send({
             message: 'Failed to create user',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    users.findAll().then(function(users) {
      res.status(200).send({ users: users});
    });
});

router.route('/:user_id').get(function(req, res) {
  	users.find({
        where: {
          id: req.params.user_id
        }
    }).then(function(user) {
          res.status(200).send({
             message: 'User found',
             user: user
          });
    });
})
