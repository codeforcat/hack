// NeoPixel Ring simple sketch (c) 2013 Shae Erisson
// released under the GPLv3 license to match the rest of the AdaFruit NeoPixel library

#include <Adafruit_NeoPixel.h>

#ifdef _AVR_
  #include <avr/power.h>
#endif

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1
#define PIN            13

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS_EYE  25
#define NUMPIXELS      (120 - NUMPIXELS_EYE)

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS + NUMPIXELS_EYE, PIN, NEO_GRB + NEO_KHZ800);

////////////////////////////////////////////////////

struct RGB {
  int r, g, b;
};
//
struct PARAM {
  float pos; //位置（0.0「根本」～1.0「先端」）
  float color; //色（0.0「赤」～1.0「青」）
  float currColor; //現在の色
  float speed; //測度（loop毎にposを更新）
  float breath; //点滅速度（0.0以上）
  float currWidth; //現在の幅※loop毎currWidthを更新する
  float width; //目的の幅（0.0「0ピン」～1.0「60ピン」）
  float rate; //変化率
  float max = 1.0f;
}param;

// 環境変数の設定
int max_random = 5;
int idle_time = 300;
int time = 70;

//時間
unsigned t = 0;
unsigned tReset = 0;

/////////////////////////////////////////////////////////

void setup() {
  
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (_AVR_ATtiny85_)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);

#endif
  //End of trinket special code
  pixels.begin(); // This initializes the NeoPixel library.

  //初期化
  param.breath = 0.02f;
  param.color = 0.0f;
  param.currColor = 1.0f;
  param.width = 0.0f;
  param.currWidth = 0.0f;
  param.pos = 0.5f;
  param.speed = 0.0f;
  param.rate = 0.0002;
  param.max = 1.0f;
  
  tReset = 500;
  
}
////////////////////

void loop() {
  
  t = t + 1; //時間の増加
  param.pos += param.speed; //位置を更新
  float d = param.width - param.currWidth; //幅を更新
  param.currWidth += param.rate * d;
  d = param.color - param.currColor; //色を更新
  param.currColor += param.rate * d;

  /////////////////////
  //このあたりでパラメータを設定する
  if ( t > tReset ) {
    if ( 1 ) {
      //基本状態
      param.color = 0.5f;
      param.breath = 0.02f;
      param.width = 0.3f;
      param.rate = 0.01f;
      param.max = 1.0f;
    } else if ( 1 ) {
      //縮まる
      param.color = 0.7f;
      param.breath = 0.05f;
      param.width = 0.05f;
      param.rate = 0.4f;
      param.max = 0.5f;
    } else if ( 0 ) {
      //伸びる
      param.color = 0.1f;
      param.breath = 0.01f;
      param.width = 2.0f;
      param.rate = 0.005f;
      param.max = 1.0f;
    }
  } else {
    if ( 0 ) {
      //逃げる
      param.color = 0.05f;
      param.breath = 0.75f;
      param.width = 0.75f;
      param.rate = 0.4f;
      param.max = 0.5f;
    } else if ( 1 ) {
      //来る
      param.color = 0.25f;
      param.breath = 0.03f;
      param.width = 2.0f;
      param.rate = 0.01f;
      param.max = 1.0f;
    }
  }
  /////////////////////

  //最小以下、最大値以上にならないように補正する
  if ( param.pos < 0.0f ) {
    param.pos = 0.0f;
  } else if ( param.pos > 1.0f ) {
    param.pos = 1.0f;
  }

  //LEDを光らせる
  for ( int i=0; i<NUMPIXELS; i++ ){
    float v = limitTurn( t * param.breath ); //時間が進むにつれて増加と減少を繰り返す
    float u = getBriFromPos( param.pos * NUMPIXELS, param.currWidth * NUMPIXELS_EYE, i ); //光らせる位置
    RGB c = getGrad( param.currColor, v * u * param.max ); //Input to RGB value

    //Show
    pixels.setPixelColor(i+NUMPIXELS_EYE, pixels.Color( c.r, c.g, c.b ));

   /**
   colorWipeIncrease(pixels.Color(255, 0, 0), time); // Red
   colorWipeDecrease(pixels.Color(255, 0, 0), time); // Red
   **/
  
  /*colorWipeSimpleIncrease(pixels.Color(255, 0, 0), time); // Red
  colorWipeSimpleDecrease(pixels.Color(255, 0, 0), time); // Red
  */
  /**
  turnOff();
  **/
  
  }
  RGB c = getGrad( param.currColor, 0.05f*param.max ); //Input to RGB value
  pixels.setPixelColor(2, pixels.Color( 4,4,4 ));
  pixels.setPixelColor(8, pixels.Color( 4,4,4 ));
  pixels.show();
  delay( 1 );
}
//////////////////////////////////////////////////////////////////
//動作させる関数
//////////////////////////////////////////////////////////////////
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
  float r;
  if ( i % 2 ) {
    r = 1.0f - (v-i);
    return r * r;
  } else {
    r = v-i;
    return r * r;
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
