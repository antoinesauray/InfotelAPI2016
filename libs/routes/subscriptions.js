var express = require('express');
var crypto = require('crypto');
var subscriptions = require('../models').subscriptions;

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
        res.send("subscriptions routes on !");
})

.post('/add', function (req, res) {
    var data = req.body;

    subscriptions.build(
      {
         channel_id: data.channel_id,
         user_id: data.user_id
      }).save()
      .then(function(subscription) {
          res.status(201).send({
             message: 'Subscription done',
             subscription: subscription
          });
      }, function(err) {
          res.status(400).send({
             message: 'Failed to do subscription',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    subscriptions.findAll().then(function(subscriptions) {
      res.status(200).send({ subscriptions: subscriptions});
    });
});

// :id
router.route('/:subscription_id')
.delete(function(req, res) {
    var subscription_id = req.params.subscription_id;
      subscriptions.findById(subscription_id).then(function(subscription) {
        if(subscription){
          subscription.destroy().then(function(subscriptions) {
              res.status(200).send({
                 message: "Subscription (" + subscription_id + ") is deleted"
              });
          });
        } else {
            res.status(200).send({
               message: 'Subscription with id = ' + subscription_id + ' already doesn\'t exist'  ,
            });
        }
      });
});
