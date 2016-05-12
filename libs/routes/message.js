//var models  = require('../models');
var express = require('express');
var router  = express.Router();
var jwt    = require('jsonwebtoken');
var exec = require('child_process').exec;

<<<<<<< HEAD:libs/routes/message.js
router.get('/post', function(req, res) {
	var type = req.query.type;
	var sender_id = 1;
	var content = req.query.content;
	var attachment_type = 1;
	var attachment_url = null;
	var topic = req.query.topic;
	var cmd = 'node ./infotel-gcm/scripts/topic2.js '+type+' '+sender_id+' '+content+' '+attachment_type+' '+attachment_url+' '+topic;
=======
router.post('/post', function(req, res) {
	var type = req.body.type;
	var sender_id = req.body.sender_id;
	var content = req.body.content;
	var attachment_type = req.body.attachment_type;
	var attachment_url = req.body.attachment_url;
	var topic = req.body.topic;
	var cmd = 'node ./infotel-gcm/scripts/topic2.js '+type+' '+sender_id+' \"'+content+'\" '+attachment_type+' '+attachment_url+' '+topic;		
>>>>>>> b27052078c7497d4c2383770cc16a19256e2c7a1:lib/routes/message.js
	console.log(cmd);
	exec(cmd, function(error, stdout, stderr) {
	// command output is in stdout
		res.status(200).send({
        		success: true,
        		message: stdout
    		});
	});
});
module.exports = router;
