var express = require('express');
var crypto = require('crypto');
var conversations = require('../models').conversations;
var private_messages = require('../models').private_messages;

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
        res.send("conversations routes on !");
})

.post('/add', function (req, res) {
    var data = req.body;

    conversations.build(
      {
         user1_id: data.user1_id,
         user2_id: data.user2_id

      }).save()
      .then(function(conversation) {
          res.status(201).send({
             message: 'Conversation created',
             conversation: conversation
          });
      }, function(err) {
          res.status(400).send({
             message: 'Failed to create conversation',
             error: err
          });
      });
})

.get('/all', function (req, res) {
    conversations.findAll().then(function(conversations) {
      res.status(200).send({ conversations: conversations});
    });
});

function loadConversation(req, res, next) {
  if (req.params.conversation_id) {
    conversations.findById(req.params.conversation_id).then(function(conversation) {
      req.conversation = conversation;
      next();
    });
  } else{
    next();
  }
};

// :id
router.route('/:conversation_id')
.get(loadConversation, function(req, res) {
  	if(req.conversation){
      res.status(200).send({
         message: 'Conversation found',
         conversation: req.conversation
      });
    } else {
      res.status(200).send({
         message: 'Conversation not found',
      });
    }
})

.post(loadConversation, function(req, res) {
    var data = req.body;
    if(req.conversation){
        var conversation = req.conversation;
        if(data.name) conversation.name = data.name;

        conversation.save().then(function(conversation) {
          res.status(200).send({
             message: 'Conversation update',
             conversation: conversation
          });
        }, function(err) {
            res.status(400).send({
               message: 'Failed to update conversation',
               error: err
            });
        });

    } else {
      res.status(200).send({
         message: 'Conversation not found',
      });
    }
})

// /:id/message
router.route('/:conversation_id/messages')
.get(function(req, res) {
      var conversation_id = req.params.conversation_id;
      private_messages.findAll({
        where: {
          conversation_id: conversation_id
        }
      }).then(function(private_messages) {
          res.status(200).send({
             message: 'Messages found for conversation: ' + conversation_id,
             private_messages: private_messages
          });
      });
});
