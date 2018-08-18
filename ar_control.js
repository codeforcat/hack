module.exports = function () {
  console.log("ar module");
  var events = require('events');
  var eventEmitter = new events.EventEmitter();
  var measure_data = {};

  // var _init = function(capsule_obj) {
  //   send_error(capsule_obj);
  // }
  // eventEmitter.init = _init;
  var five = require("johnny-five");
  var board = new five.Board();

  board.on("ready", function () {
    var strobeRound = new five.Pin(7);
    var strobeFlat = new five.Pin(8);
    var strobeCome = new five.Pin(2);
    var strobeRun = new five.Pin(4);

    eventEmitter.round = function () {
      console.log("round");
      strobeRound.high();
      strobeFlat.low();
    };
    eventEmitter.flat = function () {
      console.log("flat");
      strobeRound.low();
      strobeFlat.high();
    };
    eventEmitter.come = function () {
      console.log("come");
      strobeCome.high();
      strobeRound.low();
      strobeFlat.low();
      setTimeout(function () {
        strobeCome.low();
      }, 1000);
    };
    eventEmitter.run = function () {
      console.log("run");
      strobeRun.high();
      strobeRound.low();
      strobeFlat.low();
      setTimeout(function () {
        strobeRun.low();
      }, 1000);
    };
    eventEmitter.measure = function (data) {
      console.log("measure");
      // console.log(data);
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
