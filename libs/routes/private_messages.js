var express = require('express');
var crypto = require('crypto');
var exec = require('child_process').exec;
var conversations = require('../models').conversations;
var private_messages = require('../models').private_messages;
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
        res.send("private private_messages routes on !");
})

.post('/add', function (req, res) {
    var data = req.body;
    if(data.sender_id && data.receiver_id){
      private_messages.build(
        {
           content: data.content,
           attachment: data.attachment,
           attachment_type: data.attachment_type,
           conversation_id: data.conversation_id,
           sender_id: data.sender_id
        }).save()
        .then(function(private_message) {
            // send private_message with server
            users.findById(data.receiver_id).then(function(receiver) {
                  var token = receiver.token;
                  users.findById(data.sender_id).then(function(sender) {
                        var avatar = sender.avatar;
                        var cmd = 'node ./infotel-gcm/scripts/topic.js ' + data.sender_id + ' \"' + private_message.content + '\" ' + token + ' ' + avatar + ' ' + private_message.attachment_type + ' ';
                        if(private_message.attachment != undefined) cmd += private_message.attachment;

                        console.log(cmd);
                        exec(cmd, function(error, stdout, stderr) {
                            if(error){
                              res.status(201).send({
                                    info: 'Private message created, but can\'t be send',
                                    out: stderr,
                                    private_message: private_message
                              });
                            }
                            // command output is in stdout
                            res.status(201).send({
                                  info: 'Private message created & send',
                                  out: stdout,
                                  private_message: private_message
                            });
                        });
                    });
            });
        }, function(err) {
            res.status(400).send({
               private_message: 'Failed to create private_message',
               error: err
            });
        });
    } else {
      res.status(400).send({
         private_message: 'Need to specify \"receiver_id\" and \"sender_id\"',
      });
    }

})

.get('/all', function (req, res) {
    private_messages.findAll().then(function(private_messages) {
      res.status(200).send({ private_messages: private_messages});
    });
});

function loadPrivateMessage(req, res, next) {
  if (req.params.private_message_id) {
    private_messages.findById(req.params.private_message_id).then(function(private_message) {
      req.private_message = private_message;
      next();
    });
  } else{
    next();
  }
};

// :id
router.route('/:private_message_id')
.get(loadPrivateMessage, function(req, res) {
  	if(req.private_message){
      res.status(200).send({
         private_message: 'Private message found',
         private_message: req.private_message
      });
    } else {
      res.status(200).send({
         private_message: 'Private message not found',
      });
    }
})

.post(loadPrivateMessage, function(req, res) {
    var data = req.body;
    if(req.private_message){
        var private_message = req.private_message;
        if(data.content) private_message.content = data.content;
        if(data.attachment) private_message.attachment = data.attachment;

        private_message.save().then(function(private_message) {
          res.status(200).send({
             private_message: 'Private message update',
             private_message: private_message
          });
        }, function(err) {
            res.status(400).send({
               private_message: 'Failed to update private message',
               error: err
            });
        });

    } else {
      res.status(200).send({
         private_message: 'Private message not found',
      });
    }
});
