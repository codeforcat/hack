var ar_control = require('./ar_control')();
ar_control.on("johnnyready", function() {

// ar_control.round()
// ar_control.flat()
// ar_control.come()
ar_control.run()

  var data = {
    aaaa: "aaaaa"
  }
  ar_control.mesure(data)
});
