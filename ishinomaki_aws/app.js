var io = require('socket.io')(8080);
var fs = require('fs');
var express = require('express');
var events = require('events');
var express_app = express();
var eventEmitter = new events.EventEmitter();
const bodyParser = require('body-parser');

var oideFlag = false
express_app.use(bodyParser.urlencoded({
  extended: true
}));

express_app.listen(5555, function() {
  console.log('ishinomaki hack dummy server listening on port 5555!');
});
express_app.get('/oide', function(req, res) {
  console.log(req.body);
  oideFlag = true;
  res.send({
    "status_code": 200,
    "states_message": "success",
    "oideFlag": oideFlag
  });
  console.log("oide oideFlag ::: "+oideFlag);
})

express_app.get('/oidecheck', function(req, res) {
  console.log(req.body);
  res.send({
    "status_code": 200,
    "states_message": "success",
    "oideFlag": oideFlag
  });
  oideFlag = false;
  console.log("oidecheck oideFlag ::: "+oideFlag);
})
