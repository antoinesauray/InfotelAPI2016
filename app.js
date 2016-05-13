var express = require('express');
var bodyParser  = require('body-parser');
var models = require('./libs/models')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ----- Initialise Server
models.sequelize.sync().then(function(){

  // Si database OK on lance le serveur.
  var server = app.listen(8088, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Hub API listening at http://%s:%s", host, port)
  });

}).catch(function(error) {
  "Database connection issue: " + error;
});

// ----- Routes
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, message: 'API on !'});
});
app.use('/api/message', require('./libs/routes/message'));
app.use('/api/users', require('./libs/routes/users'));
app.use('/api/auth', require('./libs/routes/auth'));
