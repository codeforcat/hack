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
    om.on('conditionChange', function (obj) {
        console.log('conditionChange: ' + obj);
    });
    om.init(obj);
}
omron_arduino(obj);

//johnny-fiveルーチン：直書きします
function jhonny_measure(data){
    console.log('android:' + data)
    board.on("ready", function() {
        var temperature = new five.Pin({pin:3, mode: five.Pin.PWM});
        var humidity = new five.Pin({pin:5, mode: five.Pin.PWM});
        var ambientLight = new five.Pin({pin:6, mode: five.Pin.PWM});
        var pressure = new five.Pin({pin:9, mode: five.Pin.PWM});
        var soundNoise = new five.Pin({pin:10, mode: five.Pin.PWM});
        var uvIndex = new five.Pin({pin:11, mode: five.Pin.PWM});

        temperature.write(data.temperature);
        humidity.write(data.humidity);
        ambientLight.write(data.ambientLight);
        pressure.write(data.pressure);
        soundNoise.write(data.soundNoise);
        uvIndex.write(data.uvIndex);
      });
}