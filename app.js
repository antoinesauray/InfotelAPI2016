var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var routes = require('./lib/routes/index');
var message  = require('./lib/routes/message');

app.use('/api/v1', routes);
app.use('/api/v1/message', message);


var server = app.listen(8088, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Infotel API listening at http://%s:%s", host, port)

})
