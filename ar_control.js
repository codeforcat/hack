module.exports = function() {
  console.log("ar module");
  var events = require('events');
  var eventEmitter = new events.EventEmitter();
  var mesure_data = {};

  // var _init = function(capsule_obj) {
  //   send_error(capsule_obj);
  // }
  // eventEmitter.init = _init;
  var five = require("johnny-five");
  var board = new five.Board();

  board.on("ready", function() {
    var strobeRound = new five.Pin(0);
    var strobeFlat = new five.Pin(1);
    var strobeCome = new five.Pin(2);
    var strobeRun = new five.Pin(3);

    eventEmitter.round = function() {
      console.log("round");
      strobeRound.high();
    };
    eventEmitter.flat = function() {
      console.log("flat");
      strobeFlat.high();
    };
    eventEmitter.come = function() {
      console.log("come");
      strobeCome.high();
      setTimeout(function () {
        strobeCome.low();
      }, 1000);
    };
    eventEmitter.run = function() {
      console.log("run");
      strobeRun.high();
      setTimeout(function () {
        strobeRun.low();
      }, 1000);
    };
    eventEmitter.mesure = function(data) {
      console.log("mesure");
      console.log(data);
      mesure_data = data;
      // data.temperature;
      // data.humidity;
      // data.ambientLight;
      // data.uvIndex;
      // data.pressure;
      // data.soundNoise;
      // data.discomfortIndex;
      // data.heatStroke;
    };
    eventEmitter.emit('johnnyready');

  });
  return eventEmitter;


}
