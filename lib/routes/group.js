var models  = require('../models');
var express = require('express');
var router  = express.Router();
var jwt    = require('jsonwebtoken');

var env       = process.env.NODE_ENV || "token";
var config    = require(__dirname + '/../config/config.json')[env];
/*
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
}); */

router.post('/find', function(req, res) {
  models.sequelize.query("select id, name, description, avatar from \"sharing_groups\" where id not in(select g from \"user_groups\" where p=:id) and upper(name) like upper(:name)",
  { replacements: { id: req.decoded.id, name: req.body.name }, type: models.sequelize.QueryTypes.SELECT})
    .then(function(groups) {
        res.json({ success: true, message: 'Groups found for name '+req.body.name, groups: groups });
  })

});
router.post('/locations', function(req, res) {
  if(req.body.id != null){
      models.sequelize.query("SELECT a_name, s_name, ST_X(loc), ST_Y(loc) FROM \"sharing_group_locations\" where g = :id",
      { replacements: { id: req.body.id }, type: models.sequelize.QueryTypes.SELECT})
        .then(function(locations) {
            res.json({ success: true, message: 'Locations for group '+req.body.id, locations: locations });
      })
  }else{res.json({ success: false, message: 'Request failed. Please provide a group id.'});}
});
router.post('/users', function(req, res) {
  if(req.query.id != null){
      models.sequelize.query("SELECT fname, lname FROM \"persons\" where id in(SELECT g from \"user_groups\" where g = :id)",
      { replacements: { id: req.decoded.id }, type: models.sequelize.QueryTypes.SELECT})
        .then(function(users) {
            res.json({ success: true, message: 'Users for group '+req.query.id, users: users });
      })
  }else{res.json({ success: false, message: 'Request failed. Please provide a group id.'});}
});
router.post('/events', function(req, res) {
  if(req.query.id != null){
      models.sequelize.query("SELECT * FROM \"events\" where owner = :id",
      { replacements: { id: req.decoded.id }, type: models.sequelize.QueryTypes.SELECT})
        .then(function(events) {
            res.json({ success: true, message: 'eventss for group '+req.query.id, events: events });
      })
  }else{res.json({ success: false, message: 'Request failed. Please provide a group id.'});}
});
router.post('/events/past', function(req, res) {
  if(req.query.id != null){
      models.sequelize.query("select name, html, to_char(s_time, \'YYYYMMDDThh24MISS\') as s_time, to_char(e_time, \'YYYYMMDDThh24MISS\') as e_time, city, ST_X(loc), ST_Y(loc) from \"events\" where owner = :id and current_timestamp>e_time",
      { replacements: { id: req.body.id }, type: models.sequelize.QueryTypes.SELECT})
        .then(function(events) {
            res.json({ success: true, message: 'Past events for group '+req.body.id, events: events });
      })
  }else{res.json({ success: false, message: 'Request failed. Please provide a group id.'});}
});
router.post('/events/upcoming', function(req, res) {
  if(req.body.id != null){
      models.sequelize.query("select name, html, to_char(s_time, \'YYYYMMDDThh24MISS\') as s_time, to_char(e_time, \'YYYYMMDDThh24MISS\') as e_time, city, ST_X(loc), ST_Y(loc) from \"events\" where owner = :id and current_timestamp<e_time",
      { replacements: { id: req.body.id }, type: models.sequelize.QueryTypes.SELECT})
        .then(function(events) {
            res.json({ success: true, message: 'Upcoming events for group '+req.body.id, events: events });
      })
  }else{res.json({ success: false, message: 'Request failed. Please provide a group id.'});}
});

router.post('/join', function(req, res) {
    	models.sequelize.query("insert into \"user_groups\" (p, g) values (:id, :group) RETURNING *",
    	{ replacements: { id: req.decoded.id, group: req.body.id}, type: models.sequelize.QueryTypes.INSERT})
      	.then(function(result) {
    		    res.json({ success: true, message: 'You have joined group number '+req.body.id, result: result });
      })
});
router.post('/quit', function(req, res) {
    	models.sequelize.query("delete from \"user_groups\" where p = :id and g = :group",
    	{ replacements: { id: req.decoded.id, group: req.body.id}, type: models.sequelize.QueryTypes.INSERT})
      	.then(function(result) {
    		    res.json({ success: true, message: 'You have quitted group number '+req.body.id, result: result });
      })
});
module.exports = router;
