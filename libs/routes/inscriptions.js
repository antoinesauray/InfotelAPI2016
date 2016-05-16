var express = require('express');
var crypto = require('crypto');
var inscriptions = require('../models').inscriptions;

var router  = express.Router();
module.exports = router;


router.use(function(req, res, next) {
    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
})

.get('/', function (req, res) {
    var user_id = req.query.user_id;
    var event_id = req.query.event_id;
      inscriptions.findAll({
        where: {
          $and: [
            {
              user_id: user_id
            }, {
              event_id: event_id
            }
          ]
        }
      }).then(function(inscriptions) {
          res.status(200).send({
             message: 'User\'s (' + user_id + ') inscription for event (' + event_id + ')',
             inscriptions: inscriptions
          });
      });
})

.post('/add', function (req, res) {
    var data = req.body;

    inscriptions.build(
      {
         event_id: data.event_id,
         user_id: data.user_id
      }).save()
      .then(function(inscription) {
          res.status(201).send({
             message: 'Inscription done',
             inscription: inscription
          });
      }, function(err) {
          res.status(400).send({
             message: 'Failed to do inscription',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    inscriptions.findAll().then(function(inscriptions) {
      res.status(200).send({ inscriptions: inscriptions});
    });
});

// :id
router.route('/:inscription_id')
.delete(function(req, res) {
    var inscription_id = req.params.inscription_id;
      inscriptions.findById(inscription_id).then(function(inscription) {
        if(inscription){
          inscription.destroy().then(function(inscriptions) {
              res.status(200).send({
                 message: "Inscription (" + inscription_id + ") is deleted"
              });
          });
        } else {
            res.status(200).send({
               message: 'Inscription with id = ' + inscription_id + ' already doesn\'t exist'  ,
            });
        }
      });
});
