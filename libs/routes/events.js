var express = require('express');
var crypto = require('crypto');
var events = require('../models').events;
var inscriptions = require('../models').inscriptions;
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
        res.send("events routes on !");
})

.post('/add', function (req, res) {
    var data = req.body;

    events.build(
      {
         name: data.name,
         type: data.type,
         avatar: data.avatar,
         date_start: data.date_start,
         date_end: data.date_end,
         place_lon_start: data.place_lon_start,
         place_lat_start: data.place_lat_start,
         place_lon_end: data.place_lon_end,
         place_lat_end: data.place_lat_end,
         creator_id: data.creator_id
      }).save()
      .then(function(event) {
          res.status(200).send({
             message: 'Event created',
             event: event
          });
      }, function(err) {
          res.status(400).send({
             message: 'Failed to create event',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    events.findAll().then(function(events) {
      res.status(200).send({events: events});
    });
});

function loadEvent(req, res, next) {
  if (req.params.event_id) {
    events.findById(req.params.event_id).then(function(event) {
      req.event = event;
      next();
    });
  } else{
    next();
  }
};

// :id
router.route('/:event_id')
.get(loadEvent, function(req, res) {
  	if(req.event){
      res.status(200).send({
         message: 'Event found',
         event: req.event
      });
    } else {
      res.status(200).send({
         message: 'Event not found',
      });
    }
})

.delete(loadEvent, function(req, res) {
    var event = req.event;
  	if(event){
      event.destroy().then(function(event) {
          res.status(200).send({
             message: 'Event deleted',
             event: event
          });
      });
    } else {
      res.status(200).send({
         message: 'Event not found',
      });
    }
})

// :id/inscriptions/
router.route('/:event_id/inscriptions/')
.get(function(req, res) {
    var event_id = req.params.event_id;
      inscriptions.findAll({
        where: {
            event_id: event_id
        }
      }).then(function(inscriptions) {

          res.status(200).send({
             message: 'Event\'s (' + event_id + ') user inscriptions',
             inscriptions: inscriptions
          });
      });
});
