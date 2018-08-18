const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();

const bodyParser = require('body-parser');

var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

var server = app.listen(8080, function () {
    console.log("Node.js is listening to PORT:" + server.address().port);
});

app.get('/recog/', function (req, res) {
    console.log(req.body)
    // console.log('>>deeplenz: tag:' + req.body.tag + ' appear: ' + req.body.appear);
    if (req.body.tag == 'dog' && req.body.appear == 'true') {
        ar_control.run();
    }
    res.send('にゃーん');
});

var axios = require('axios');

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
        ar_control.measure(obj)
    });
    om.on('flat', function (obj) {
        ar_control.flat()
    });
    om.on('round', function (obj) {
        ar_control.round()
    });

    om.init(obj);
}

ar_control.on("johnnyready", function () {
    omron_arduino(obj);
});


// Clova -> arduino
// Client API を定期的に叩く
var oide = function () {
    axios.get('http://13.230.152.221:5555/oidecheck')
        .then(response => {
            if (response.data.oideFlag) {
                ar_control.come();
            }
        });
}
setInterval(oide, 1000);
