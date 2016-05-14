var express = require('express');
var crypto = require('crypto');
var exec = require('child_process').exec;
var channels = require('../models').channels;
var messages = require('../models').messages;
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
        res.send("messages routes on !");
})

.post('/add', function (req, res) {
    var data = req.body;

    messages.build(
      {
         content: data.content,
         attachment: data.attachment,
         attachment_type: data.attachment_type,
         channel_id: data.channel_id,
         user_id: data.user_id
      }).save()
      .then(function(message) {
          // send message with server
          channels.findById(message.channel_id).then(function(channel) {
              var topic = channel.name;
              users.findById(message.user_id).then(function(user) {
                    var avatar = user.avatar;

                    var cmd = 'node ./infotel-gcm/scripts/topic.js ' + message.user_id + ' \"' + message.content + '\" ' + topic + ' ' + avatar + ' ' + message.attachment_type + ' ';
                    if(message.attachment != undefined) cmd += message.attachment;
                    console.log(cmd);
                    exec(cmd, function(error, stdout, stderr) {
                        if(error){
                          res.status(201).send({
                                info: 'Message created, but can\'t be send',
                                out: stderr,
                                message: message
                          });
                        }
                        // command output is in stdout
                        res.status(201).send({
                              info: 'Message created & send',
                              out: stdout,
                              message: message
                        });
                    });
              });
          });
      }, function(err) {
          res.status(400).send({
             message: 'Failed to create message',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    messages.findAll().then(function(messages) {
      res.status(200).send({ messages: messages});
    });
});

function loadMessage(req, res, next) {
  if (req.params.message_id) {
    messages.findById(req.params.message_id).then(function(message) {
      req.message = message;
      next();
    });
  } else{
    next();
  }
};

// :id
router.route('/:message_id')
.get(loadMessage, function(req, res) {
  	if(req.message){
      res.status(200).send({
         message: 'Message found',
         message: req.message
      });
    } else {
      res.status(200).send({
         message: 'Message not found',
      });
    }
})

.post(loadMessage, function(req, res) {
    var data = req.body;
    if(req.message){
        var message = req.message;
        if(data.content) message.content = data.content;
        if(data.attachment) message.attachment = data.attachment;

        message.save().then(function(message) {
          res.status(200).send({
             message: 'Message update',
             message: message
          });
        }, function(err) {
            res.status(400).send({
               message: 'Failed to update message',
               error: err
            });
        });

    } else {
      res.status(200).send({
         message: 'Message not found',
      });
    }
});
