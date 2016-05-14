var express = require('express');
var crypto = require('crypto');
var channels = require('../models').channels;
var messages = require('../models').messages;

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
        res.send("channels routes on !");
})

.post('/add', function (req, res) {
    var data = req.body;

    channels.build(
      {
         name: data.name,
         full_name: data.full_name,
         avatar: data.avatar
      }).save()
      .then(function(channel) {
          res.status(201).send({
             message: 'Channel created',
             channel: channel
          });
      }, function(err) {
          res.status(400).send({
             message: 'Failed to create channel',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    channels.findAll().then(function(channels) {
      res.status(200).send({ channels: channels});
    });
});

function loadChannel(req, res, next) {
  if (req.params.channel_id) {
    channels.findById(req.params.channel_id).then(function(channel) {
      req.channel = channel;
      next();
    });
  } else{
    next();
  }
};

// :id
router.route('/:channel_id')
.get(loadChannel, function(req, res) {
  	if(req.channel){
      res.status(200).send({
         message: 'Channel found',
         channel: req.channel
      });
    } else {
      res.status(200).send({
         message: 'Channel not found',
      });
    }
})

.post(loadChannel, function(req, res) {
    var data = req.body;
    if(req.channel){
        var channel = req.channel;
        if(data.name) channel.name = data.name;
        if(data.full_name) channel.full_name = data.full_name;

        channel.save().then(function(channel) {
          res.status(200).send({
             message: 'Channel update',
             channel: channel
          });
        }, function(err) {
            res.status(400).send({
               message: 'Failed to update channel',
               error: err
            });
        });

    } else {
      res.status(200).send({
         message: 'Channel not found',
      });
    }
})

// /:id/mesage
router.route('/:channel_id/messages')
.get(function(req, res) {
    var channel_id = req.params.channel_id;
      messages.findAll({
        where: {
          channel_id: channel_id
        }
      }).then(function(messages) {
          res.status(200).send({
             message: 'Message found for channel: ' + channel_id,
             messages: messages
          });
      });
});
