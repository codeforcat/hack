#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 13

int max_random = 5;
int idle_time = 300;
int time = 70;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(60, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
  #if defined (__AVR_ATtiny85__)
    if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
  #endif
  // End of trinket special code

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

void loop() {

/**
  colorWipeIncrease(strip.Color(255, 0, 0), time); // Red
  colorWipeDecrease(strip.Color(255, 0, 0), time); // Red
**/
  
  colorWipeSimpleIncrease(strip.Color(255, 0, 0), time); // Red
  colorWipeSimpleDecrease(strip.Color(255, 0, 0), time); // Red

/**
  turnOff();
**/

}

// LED電源OFF処理
void turnOff() {
  for (int i=0;i<strip.numPixels();i++) {
    strip.setPixelColor(i, 0);
  }
}

// 単色のチェイス（+方向/継続）
// 引数１：色・引数２：時間
// <前提>消灯中
void colorWipeIncrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}

// 単色のチェイス（-方向/継続）
// 引数１：色・引数２：時間
// <前提>点灯中
void colorWipeDecrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=strip.numPixels(); i>0; i--) {
    strip.setPixelColor(i, 0);
    strip.show();
    delay(wait);
  }
}

// 単色のチェイス（+方向/単発）
// 引数１：色・引数２：時間
// <前提>消灯中
void colorWipeSimpleIncrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.setPixelColor(i-1, 0);
    strip.show();
    //ランダムの結果により静止
    if (random(max_random) > 3) {
       delay(idle_time);
    }
    delay(wait);
  }
}

// 単色のチェイス（-方向/単発）
// 引数１：色・引数２：時間
// <前提>点灯中
void colorWipeSimpleDecrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=strip.numPixels(); i>0; i--) {
    strip.setPixelColor(i, c);
    strip.setPixelColor(i+1, 0);
    strip.show();
    //ランダムの結果により静止
    if (random(max_random) > 3) {
       delay(idle_time);
    }
    delay(wait);
  }
}

