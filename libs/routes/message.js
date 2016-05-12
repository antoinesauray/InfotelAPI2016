//var models  = require('../models');
var express = require('express');
var router  = express.Router();
var jwt    = require('jsonwebtoken');
var exec = require('child_process').exec;

router.get('/post', function(req, res) {
	var type = req.query.type;
	var sender_id = 1;
	var content = req.query.content;
	var attachment_type = 1;
	var attachment_url = null;
	var topic = req.query.topic;
	var cmd = 'node ./infotel-gcm/scripts/topic2.js '+type+' '+sender_id+' '+content+' '+attachment_type+' '+attachment_url+' '+topic;
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
