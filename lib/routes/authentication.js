var models  = require('../models');
var express = require('express');
var router  = express.Router();
var crypto = require('crypto');
var jwt    = require('jsonwebtoken');

var env       = process.env.NODE_ENV || "token";
var config    = require(__dirname + '/../config/config.json')[env];

var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

router.post('/user', function(req, res) {
	if(req.body.mail!=null){
        models.persons.findOne({
                where: {mail: req.body.mail}
        }).then(function(person) {
                if(person==null){
                        res.json(200, { success: false, message: 'Authentication failed. User not found.' });
                }
                else{
                        if(req.body.password!=null){
                                var sha256 = crypto.createHash("sha256");
                                sha256.update(req.body.password+person.salt, "utf8");//utf8 here
                                var result = sha256.digest("base64");
                                console.log("sha256="+person.password);
                                console.log("password="+req.body.password);
                                console.log("sha256(password)="+result);
                                if(result!=person.password){
                                        res.status(200).json({ success: false, message: 'Authentication failed. Wrong password.' });
                                }
                                else{
                                        var token = jwt.sign({id: person.id}, config.secret, {expiresIn: 1440});
                                        models.sequelize.query("SELECT id, mail, fname, lname, avatar, city, title, bday FROM \"persons\" where \"persons\".id = :id LIMIT 1",
                                        { replacements: { id: person.id }, type: models.sequelize.QueryTypes.SELECT})
                                          .then(function(user) {
                                              res.status(200).json({
                                              success: true,
                                              message: 'Access token',
                                              token: token,
                                              user: user
                                              });
                                        })

                                }
                        }
                        else{
                            res.status(200).json({ success: false, message: 'Authentication failed. Wrong password.' });
                        }
                }
        });
	}else{res.json({ success: false, message: 'Authentication failed. Please provide a mail address.' });}
});
router.post('/group', function(req, res) {
	if(req.body.mail!=null){
        models.SharingGroup.findOne({
                where: {mail: req.body.mail}
        }).then(function(person) {
                if(person==null){
                        res.json({ success: false, message: 'Authentication failed. Group not found.' });
                }
                else{
                        if(req.body.password!=null){
                                var sha256 = crypto.createHash("sha256");
                                sha256.update(req.body.password+person.salt, "utf8");//utf8 here
                                var result = sha256.digest("base64");
                                if(result!=person.password){
                                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                                }
                                else{
                                        var token = jwt.sign({id: person.id}, config.secret, {expiresInMinutes: 1440});
																				res.json(200, {
                                        success: true,
                                        message: 'Access token',
                                        token: token
                                        });
                                }
                        }
                        else{
                                res.json({ success: false, message: 'Authentication failed. Wrong password.' })
                        }
                }
        });
	}else{res.json({ success: false, message: 'Authentication failed. Please provide a mail address.' });}
});

router.post('/user/register', function(req, res) {
	if(req.body.mail!=null && req.body.password!=null
	&& req.body.fname!=null && req.body.lname!=null && req.body.birthday){
		var salt = crypto.randomBytes(16).toString('base64');
		var sha256 = crypto.createHash("sha256");
                sha256.update(req.body.password+salt, "utf8");//utf8 here
		var hashedPass = sha256.digest("base64");
		models.persons.create(
		{ mail: req.body.mail,
		  password:  hashedPass,
		  salt: salt,
		  lastname: req.body.lname,
                  firstname: req.body.fname,
		  birthday: new Date(req.body.birthday)})
  		.then(function(person) {
				var token = jwt.sign({id: person.id}, config.secret, {expiresIn: 1440});
				res.json(200, { status: 200, success: true, message: 'Registering process has succeeded. You can now use your credentials.' , id: person.id, token: token });
  		})
	}
	else{res.json(200, { success: false, message: 'Registering process failed. Wrong arguments' });}
});

router.post('/group/register', function(req, res) {
	if(req.body.mail!=null && req.body.password!=null
	&& req.body.name!=null && req.body.avatar != null && req.body.description){
		var salt = crypto.randomBytes(16).toString('base64');
		var sha256 = crypto.createHash("sha256");
                sha256.update(req.body.password+salt, "utf8");//utf8 here
		var hashedPass = sha256.digest("base64");
		models.SharingGroup.create(
		{ mail: req.body.mail,
		  password:  hashedPass,
		  salt: salt,
		  name: req.body.name,
      avatar: req.body.avatar,
      description: req.body.description})
  		.then(function(person) {
				res.json(200, { status: 200, success: true, message: 'Registering process has succeeded. You can now use your credentials.' , id: person.id });
  		})
	}
	else{res.json(200, { success: false, message: 'Registering process failed. Wrong arguments' });}
});

router.get('/mail', function(req, res) {
	console.log(req.query);
		if(req.query.mail!=null){
			models.sequelize.query("select id from \"persons\" where mail= :mail",
			{ replacements: { mail: req.query.mail }, type: models.sequelize.QueryTypes.SELECT})
				.then(function(users) {
						res.json(200, { success: true, message: 'user corresponding to mail '+req.query.mail, users: users });
			})
		}
		else{res.json(200, {success: false, message: 'Please provide a mail to check availability'});}

});
module.exports = router;
