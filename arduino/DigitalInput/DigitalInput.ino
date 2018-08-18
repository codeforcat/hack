/*
 Input Pullup Serial

 This example demonstrates the use of pinMode(INPUT_PULLUP). It reads a
 digital input on pin 2 and prints the results to the serial monitor.

 The circuit:
 * Momentary switch attached from pin 2 to ground
 * Built-in LED on pin 13

 Unlike pinMode(INPUT), there is no pull-down resistor necessary. An internal
 20K-ohm resistor is pulled to 5V. This configuration causes the input to
 read HIGH when the switch is open, and LOW when it is closed.

 created 14 March 2012
 by Scott Fitzgerald

 http://www.arduino.cc/en/Tutorial/InputPullupSerial

 This example code is in the public domain

 */

void setup() {
  //start serial connection
  Serial.begin(4800);

  pinMode(8, INPUT);
  pinMode(9, INPUT);
  pinMode(10, INPUT);
  pinMode(11, INPUT);
  pinMode(13, OUTPUT);

}

void loop() {
  //read the pushbutton value into a variable
  int sensorVal0 = digitalRead(8);
  int sensorVal1 = digitalRead(9);
  int sensorVal2 = digitalRead(10);
  int sensorVal3 = digitalRead(11);
  //print out the value of the pushbutton
  Serial.println(sensorVal0);
  Serial.println(sensorVal1);
  Serial.println(sensorVal2);
  Serial.println(sensorVal3);
  Serial.println('---------');

  // Keep in mind the pullup means the pushbutton's
  // logic is inverted. It goes HIGH when it's open,
  // and LOW when it's pressed. Turn on pin 13 when the
  // button's pressed, and off when it's not:
  if (sensorVal0 == 1) {
    digitalWrite(13, HIGH);
    delay(500);
    digitalWrite(13, LOW);
  } else if (sensorVal1 == 1) {
    digitalWrite(13, HIGH);
    delay(1000);
    digitalWrite(13, LOW);
  } else if (sensorVal2 == 1) {
    digitalWrite(13, HIGH);
    delay(2000);
    digitalWrite(13, LOW);
  } else if (sensorVal3 == 1) {
    digitalWrite(13, HIGH);
    delay(3000);
    digitalWrite(13, LOW);
  } else {
    digitalWrite(13, LOW);
  }
}



