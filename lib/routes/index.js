//var models  = require('../models');
var express = require('express');
var router  = express.Router();
var crypto = require("crypto");

router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the Infotel API' });
});

module.exports = router;
