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
        res.send("users routes on !");
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

function loadUser(req, res, next) {
  if (req.params.user_id) {
    users.findById(req.params.user_id).then(function(user) {
      req.user = user;
      next();
    });
  } else{
    next();
  }
};

// :id
router.route('/:user_id')
.get(loadUser, function(req, res) {
  	if(req.user){
      res.status(200).send({
         message: 'User found',
         user: req.user
      });
    } else {
      res.status(200).send({
         message: 'User not found',
      });
    }
})

.post(loadUser, function(req, res) {
    var data = req.body;
    if(req.user){
        var user = req.user;
        if(data.firstname) user.firstname = data.firstname;
        if(data.lastname) user.lastname = data.lastname;
        if(data.mail) user.mail = data.mail;
        user.save().then(function(user) {
          res.status(200).send({
             message: 'User update',
             user: user
          });
        }, function(err) {
            res.status(409).send({
               message: 'Failed to update user',
               error: err
            });
        });
    } else {
      res.status(200).send({
         message: 'User not found',
      });
    }
})
