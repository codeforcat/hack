/*

Deeplenz http exprss受け
GET
http://192/168.x.x:8080/recog
{tag: dog, appear:true}

OMRON sensor BLE
function
temparature()
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
        console.log('measure: ' + obj);
    });
    om.on('conditionChange', function (obj) {
        console.log('conditionChange: ' + obj);
    });
    om.init(obj);
}
omron_arduino(obj);
