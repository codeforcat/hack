/*

Deeplenz http exprss受け
GET
http://192/168.x.x:8080/recog
{tag: dog, appear:true}

OMRON sensor BLE
function
temperature()
high,low

LINE Clova socket

Arduino LED serial
module: ar_control
function start_ar()
maru/nobi/oide

*/
// var Promise = require('promise');
// var promise = Promise.resolve();
const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();


var five = require("johnny-five");
var board = new five.Board();

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
var ar_control = require('./ar_control');

var obj = {};

// OMRON -> Arudino
var omron_arduino = function () {
    let om = omron();
    om.on('measure', function (obj) {
        // measure: {"row":9,
        // "temperature":23.76,3
        // "humidity":58.91,5
        // "ambientLight":123,
        // "uvIndex":0.02,6
        // "pressure":1012.8,9
        // "soundNoise":34.97,11
        // "discomfortIndex":70.97,
        // "heatStroke":21.26,
        // "batteryVoltage":2914}
        console.log('measure: ' + obj.temperature);
        jhonny_measure(obj);
    });
    om.on('flat', function (obj) {
        console.log('たいらになるにゃー');
    });
    om.on('round', function (obj) {
        console.log('まるまるにゃー');
    });

    om.init(obj);
}
omron_arduino(obj);

// Clova -> arduino
// Client API を読み込む
var io = require('socket.io-client');

// 通信先のサーバを指定する
// var socket = io('http://localhost:8080');
var socket = io('http://13.230.152.221:8080');

socket.on('connecttest', function (data) {
    // サーバから受け取ったデータを出力する
    console.log(data);
    socket.emit('fromclient', {
        my: 'data'
    });
});
socket.on('oide', function (data) {
    // サーバから受け取ったデータを出力する
});


// Deeplenz -> arduino


//johnny-fiveルーチン：直書きします
//気温など6種類を送信
function jhonny_measure(data) {
    console.log('arduino:' + JSON.stringify(data));
    board.on("ready", function (data) {
        var temp = parseInt(((parseFloat(data.temperature) - 10.0) / 20.0) * 255);
        this.pinMode(3, five.Pin.PWM);
        this.analogWrite(3, temp);
        console.log("temp255" + temp);
        // var temperature = new five.Pin({pin:3, mode: five.Pin.PWM});
        // var humidity = new five.Pin({pin:5, mode: five.Pin.PWM});
        // var ambientLight = new five.Pin({pin:6, mode: five.Pin.PWM});
        // var pressure = new five.Pin({pin:9, mode: five.Pin.PWM});
        // var soundNoise = new five.Pin({pin:10, mode: five.Pin.PWM});
        // var uvIndex = new five.Pin({pin:11, mode: five.Pin.PWM});

        // temperature.write(data.temperature);
        // humidity.write(data.humidity);
        // ambientLight.write(data.ambientLight);
        // pressure.write(data.pressure);
        // soundNoise.write(data.soundNoise);
        // uvIndex.write(data.uvIndex);
    });
}
//