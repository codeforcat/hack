var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var strobe = new five.Pin(13);
  var state = 0x00;

  this.loop(500, function() {
    strobe.write(state ^= 0x01);
  });
});
