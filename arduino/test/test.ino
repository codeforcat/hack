// NeoPixel Ring simple sketch (c) 2013 Shae Erisson
// released under the GPLv3 license to match the rest of the AdaFruit NeoPixel library

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1
#define PIN            13

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS      60

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif
  // End of trinket special code

  pixels.begin(); // This initializes the NeoPixel library.
}

///////////////////////////////////////////////////////////////////
struct RGB {
  int r, g, b;
};

// 環境変数の設定
int max_random = 5;
int idle_time = 300;
int time = 70;

//color：色を指定（0.0「赤」→0.5「緑」→1.0「青」）
//bri：輝度（0.0「0」→1.0「255」）
struct RGB getGrad ( float color, float bri ) {
  int rgbMax = bri*255;
  RGB a = { 0, 0, 0 };
         if ( color < 0.25f ) {
          a.r = rgbMax;
          a.g = (color*4.0f)*rgbMax;
          a.b = 0;
  } else if ( color < 0.50f ) {
          a.r = rgbMax-((color-0.25f)*4.0f)*rgbMax;
          a.g = rgbMax;
          a.b = 0;
  } else if ( color < 0.75f ) {
          a.r = 0;
          a.g = rgbMax;
          a.b = ((color-0.50f)*4.0f)*rgbMax;
  } else if ( color < 1.0f ) {
          a.r = 0;
          a.g = rgbMax-((color-0.75f)*4.0f)*rgbMax;
          a.b = rgbMax;
  } else {
          a.r = 0;
          a.g = 0;
          a.b = rgbMax;
  }
  return a;
}
//0～1.0までは増加、1.0～2.0までは減少、2.0～3.0までは増加、・・・、を繰り返す
float limitTurn ( float v ) {
  int i = (int)(v);
  if ( i % 2 ) {
    return 1.0f - (v-i);
  } else {
    return v-i;
  }
}
//位置から明るさを計算
//pos：光らせる位置
//w：光らせる幅
//i：LEDの番号
float getBriFromPos ( int pos, int w, int i ) {
  if ( i > pos - w && i < pos + w ) {
    int x = pos - i;
    if ( x < 0 ) x = -x;
    float v = (float)(w-x)/w;
    return v * v; //関数を滑らかにする
  }
  return 0.0f;
}

//時間
unsigned t = 0;

void loop() {

  t = t + 5; //時間の増加

  for ( int i=0; i<NUMPIXELS; i++ ){

    float v = limitTurn( t / 100.0f ); //時間が進むにつれて増加と減少を繰り返す
    float u = getBriFromPos( 30, 15, i ); //光らせる位置（15なので、半分の位置）
    
    //Input to RGB value
    RGB c = getGrad( 0.5f, v * v * v * u );

    //Show
    pixels.setPixelColor(i, pixels.Color( c.r, c.g, c.b ));
    pixels.show();

   /**
   colorWipeIncrease(pixels.Color(255, 0, 0), time); // Red
   colorWipeDecrease(pixels.Color(255, 0, 0), time); // Red
   **/
  
  //colorWipeSimpleIncrease(pixels.Color(255, 0, 0), time); // Red
  //colorWipeSimpleDecrease(pixels.Color(255, 0, 0), time); // Red

  /**
  turnOff();
  **/

  }
  delay( 1 );
  
}

/////////////////////////////////////////////////////

// LED電源OFF処理
void turnOff() {
  for (int i=0;i<pixels.numPixels();i++) {
    pixels.setPixelColor(i, 0);
  }
}

// 単色のチェイス（+方向/継続）
// 引数１：色・引数２：時間
// <前提>消灯中
void colorWipeIncrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<pixels.numPixels(); i++) {
    pixels.setPixelColor(i, c);
    pixels.show();
    delay(wait);
  }
}

// 単色のチェイス（-方向/継続）
// 引数１：色・引数２：時間
// <前提>点灯中
void colorWipeDecrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=pixels.numPixels(); i>0; i--) {
    pixels.setPixelColor(i, 0);
    pixels.show();
    delay(wait);
  }
}

// 単色のチェイス（+方向/単発）
// 引数１：色・引数２：時間
// <前提>消灯中
void colorWipeSimpleIncrease(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<pixels.numPixels(); i++) {
    pixels.setPixelColor(i, c);
    pixels.setPixelColor(i-1, 0);
    pixels.show();
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
  for(uint16_t i=pixels.numPixels(); i>0; i--) {
    pixels.setPixelColor(i, c);
    pixels.setPixelColor(i+1, 0);
    pixels.show();
    //ランダムの結果により静止
    if (random(max_random) > 3) {
       delay(idle_time);
    }
    delay(wait);
  }
}
