//var models  = require('../models');
var express = require('express');
var router  = express.Router();
var jwt    = require('jsonwebtoken');
var exec = require('child_process').exec;

router.post('/post', function(req, res) {
	var sender_id = req.body.sender_id;
	var content = req.body.content;
	var attachment_type = req.body.attachment_type;
	var attachment_url = req.body.attachment_url;
	var topic = req.body.topic;
	var cmd = 'node ./infotel-gcm/scripts/topic.js '+sender_id+' \"'+content+'\" '+attachment_type+' '+attachment_url+' '+topic;
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
