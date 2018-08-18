module.exports = function() {
  console.log("ar module");
  var events = require('events');
  var eventEmitter = new events.EventEmitter();
  var five = require("johnny-five");
  var board = new five.Board();
  var measure_data = {};

  board.on("ready", function() {
    var strobe = new five.Pin({
      pin: 6,
      mode: five.Pin.PWM
    });
    var state = 0;

    this.loop(500, function() {
      strobe.write(state++);
      if (state > 256) {
        state = 0;
      }
      console.log(state);
    });
  });

  // var _init = function(capsule_obj) {
  //   send_error(capsule_obj);
  // }
  // eventEmitter.init = _init;
  eventEmitter.round = function() {
    console.log("round");
  };
  eventEmitter.flat = function() {
    console.log("flat");

  };
  eventEmitter.come = function() {
    console.log("come");

  };
  eventEmitter.run = function() {
    console.log("run");

  };
  eventEmitter.measure = function(data) {
    console.log("measure");
    console.log(data);
    measure_data = data;
    // data.temperature;
    // data.humidity;
    // data.ambientLight;
    // data.uvIndex;
    // data.pressure;
    // data.soundNoise;
    // data.discomfortIndex;
    // data.heatStroke;
  };

  return eventEmitter;


}
