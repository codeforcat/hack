module.exports = function(){
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
    console.log(data);
});

}