var models  = require('../models');
var express = require('express');
var router  = express.Router();
var jwt    = require('jsonwebtoken');

var env       = process.env.NODE_ENV || "token";
var config    = require(__dirname + '/../config/config.json')[env];

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
});

router.get('/', function(req, res) {
	res.json({ message: 'Authenticated on user API' });
});
router.post('/locations', function(req, res) {
  if(req.body.id != null){
      models.sequelize.query("SELECT a_name, s_name, ST_X(loc), ST_Y(loc) from \"user_locations\" where shared=true and p in (select p1 from \"friends\" where p2=:id union select p2 from \"friends\" where p1=:id) order by s_name asc",
      { replacements: { id: req.decoded.id }, type: models.sequelize.QueryTypes.SELECT})
        .then(function(locations) {
            res.json({ success: true, message: 'Locations for user '+req.body.id, locations: locations });
      })
  }else{res.json({ success: false, message: 'Request failed. Please provide a user id.'});}
});

router.post('/find', function(req, res) {
  var q1 = "select id from \"persons\" where (upper(fname) like upper(:fname) and upper(lname) like upper(:lname)) OR (upper(lname) like upper(:fname) and upper(lname) like upper(:lname))"
  var q2 = "select p1 as id from \"friends\" where p2= :id and pending=1 union select p2 from \"friends\" where p1= :id and pending=1 union select id from \"persons\" where id= :id";
  var query = "select id, fname, lname, avatar, city, title from \"persons\" where id in ("+q1+") and id not in ("+q2+")";
  models.sequelize.query(query+" limit 20",
  { replacements: { id: req.decoded.id, lname: '%'+req.body.lname+'%', fname: '%'+req.body.fname+'%' }, type: models.sequelize.QueryTypes.SELECT})
    .then(function(users) {
        res.json({ success: true, message: 'Users found for name '+req.body.fname+' '+req.body.lname, users: users });
  })

});

router.get('/request', function(req, res) {
  try{
    models.sequelize.query("insert into \"friends\" (p1, p2, pending) values(:id, :user, 0) returning p2",
    { replacements: { id: req.decoded.id, user: req.query.id}, type: models.sequelize.QueryTypes.INSERT})
      .then(function(users) {
          res.json(200, { success: true, message: 'Request user  '+req.query.id+' as friend'});
    })
  }
  catch(err){
    models.sequelize.query("update \"friends\" set pending=0 where p1= :id and p2 = :user returning p2",
    { replacements: { id: req.decoded.id, user: req.query.id}, type: models.sequelize.QueryTypes.UPDATE})
      .then(function(users) {
          res.json(200, { success: true, message: 'Request user  '+req.query.id+' as friend'});
    })
  }
});

router.get('/accept', function(req, res) {
  models.sequelize.query("update \"friends\" set pending = 1 where p2 = :id returning p2",
  { replacements: { id: req.decoded.id, user: req.query.id}, type: models.sequelize.QueryTypes.INSERT})
    .then(function(users) {
        res.json(200, { success: true, message: 'Accepted friend request of user'+req.query.id});
  })
});

router.get('/reject', function(req, res) {
  //models.sequelize.query("update \"friends\" set pending = 2 where p2 = :id returning p2",
  models.sequelize.query("delete from \"friends\" where p2 = :id returning p2",
  { replacements: { id: req.decoded.id, user: req.query.id}, type: models.sequelize.QueryTypes.DELETE})
    .then(function(users) {
        res.json(200, { success: true, message: 'Rejected friend request of user'+req.query.id});
  })
});




module.exports = router;
