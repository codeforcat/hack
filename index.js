const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();

var express = require('express');
var app = express();

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
// var ar_control = require('./ar_control');

var obj = {};

// OMRON -> Arudino
var omron_arduino = function () {
    let om = omron();
    om.on('measure', function (obj) {
        console.log('>>omron: 気温は' + obj.temperature);
    });
    om.on('flat', function (obj) {
        console.log('>>omron: たいらになるにゃー');
    });
    om.on('round', function (obj) {
        console.log('>>omron: まるまるにゃー');
    });

    om.init(obj);
}
omron_arduino(obj);

// Clova -> arduino
// Client API を定期的に叩く



// Deeplenz -> arduino
