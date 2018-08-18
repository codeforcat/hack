var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var strobe = new five.Pin({pin:6, mode: five.Pin.PWM});
  var state = 0;

  this.loop(500, function() {
    strobe.write(state++);
    if (state > 256) {
      state = 0;
    }
    console.log(state);
  });
});
