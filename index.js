const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();

var express = require('express');
var app = express();
var axios = require('axios');

var server = app.listen(8080, function () {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

app.get('/recog/', function (req, res) {
    console.log('>>deeplenz: tag:' + req.query.tag + ' appear: ' + req.query.appear);
    res.send('にゃーん');
});


// モジュール
// var deeplenz = require('./deeplenz');
var omron = require('./omron/omron');
// var clova = require('./clova');
var ar_control = require('./ar_control')();

var obj = {};

// OMRON -> Arudino
var omron_arduino = function () {
    let om = omron();
    om.on('measure', function (obj) {
        ar_control.measure()
    });
    om.on('flat', function (obj) {
        ar_control.flat()
    });
    om.on('round', function (obj) {
        ar_control.round()
    });

    om.init(obj);
}
omron_arduino(obj);

// Clova -> arduino
// Client API を定期的に叩く
var oide = function(){
    axios.get('http://13.230.152.221:5555/oidecheck')
    .then(response => {
        if(response.data.oideFlag){
            ar_control.come();
        } else {
            ar_control.run();
        }
    });
}
setInterval(oide, 1000);
