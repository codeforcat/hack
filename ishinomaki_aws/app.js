var io = require('socket.io')(8080);
var fs = require('fs');
var express = require('express');
var events = require('events');
var express_app = express();
var eventEmitter = new events.EventEmitter();
const bodyParser = require('body-parser');


io.on('connection', function(socket) {
  // クライアントへデータ送信
  // emit を使うとイベント名を指定できる
  socket.emit('connecttest', {
    hello: 'world'
  });
  socket.on('fromclient', function(data) {
    // クライアントから受け取ったデータを出力する
    console.log(data);
  });



  express_app.use(bodyParser.urlencoded({
    extended: true
  }));

  express_app.listen(5555, function() {
    console.log('ishinomaki hack dummy server listening on port 5555!');
  });
  express_app.get('/oide', function(req, res) {
    console.log(req.body);
    socket.emit('oide', {tohack: 'oideoide'});

    res.send({
      "status_code": 200,
      "states_message": "success"
    });
  })
});
