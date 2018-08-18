const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();
const request = require('request');

//リクエストヘッダーを定義
var headers = {
    'Content-Type':'application/json'
}

var five = require("johnny-five");
var board = new five.Board();

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

        //オプションを定義
        var options = {
            url: 'https://sample-bot-node.herokuapp.com/sendStatus',
            method: 'GET',
            headers: headers,
            json: true,
            form: {'param':'come'}
        }
        //リクエスト送信
        request(options, function (error) {
            //コールバックで色々な処理
            console.log(error);
        })
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
