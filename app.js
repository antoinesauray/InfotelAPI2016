var express = require('express');
var bodyParser  = require('body-parser');
var models = require('./libs/models')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// models singleton
//app.set('models', models);

// ----- Initialise Server
models.sequelize.sync().then(function(){

  // Si database OK on lance le serveur.
  var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Hub infotel API listening at http://%s:%s", host, port)
  });

}).catch(function(error) {
  "Database connection issue: " + error;
});

// ----- Routes
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, message: 'API on !'});
});
