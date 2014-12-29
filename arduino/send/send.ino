#include<string>
#include "Timer.h"
#include "control.h"
#include "util.h"
#include <Bounce.h>
#include "encoder.h"
#include <stdlib.h>
const String str="guoyanchang,niubility,Hello,World.";
const unsigned char keyboardSize=4;
const unsigned char keyPin[keyboardSize]={A7,A6,A5,A4};
Bounce  bouncer[keyboardSize];
Encoder encoder(str);
void setup() {
  pinMode(switchPin,OUTPUT);
  digitalWrite(47,HIGH);
  Serial.begin(9600);
  clearDigits(0);
  *p_index=(1<<4)+1;
  timer.every(transferPeriod,cyclicalLoop);
  for(int i=0;i<keyboardSize;i++){
    bouncer[i].attach(keyPin[i]);
    bouncer[i].interval(20);
  }
  setMode(cycle);
}

void loop() {
  if(Serial.available()){
    num=serReadInt();
    digit=serReadInt();
    setDigit1(num,digit);
  }
  //setMode(MMode(readKeyboard()));
  timer.update();
}

void cyclicalLoop(){
  switch(mod){
  case test:
     testLoop();
  break;
  case interact:
    interactLoop();
  break;
  case cycle:
    cycleLoop();
  break;
  }
}

void testLoop(){
  if(stat==loc){
    const int testLocPeriod=5000;
    static int testLocLoops=testLocPeriod/transferPeriod;
    if(testLocLoops<=0){
      testLocLoops=testLocPeriod/transferPeriod;
      Serial.print("test loc loops:");
      Serial.print(testLocLoops);
      Serial.print(" ");
      setStatus(trans);
      return;
    }
    setLocateDigit();
    testLocLoops--;
  }
  else{
    if(*p_index>=(1<<7)){
      *p_index=0;
      test_idx++;
      if(test_idx>=indexN){
        test_idx=0;
        setStatus(loc);
        return;
      }else{
        p_index=index[test_idx];
        if(test_idx==0){
          *p_index=1<<4;
        }
        setStatus(trans);
      }
    }else{
      if(test_idx==0)
        setDigit(index1.line,index1.row,index1.digit);
      else if(test_idx==1)
        setDigit(index2.line,index2.row,index2.digit);
      else
        setDigit(random(w),random(w),random(maxDigit));
      (*p_index)++;
    }
  }
  setSwitchDigit(1,1);
}

static int cycleLoops=0;
void cycleLoop(){
  Serial.print("cycle:");
  Serial.println(cycleLoops);
  cycleLoops++;
  switch(stat){
  case loc:{
    const int cycleLocPeriod=5000;
    static int cycleLocLoops=cycleLocPeriod/transferPeriod;
    if(--cycleLocLoops<0){
      cycleLocLoops=cycleLocPeriod/transferPeriod;
      setStatus(head);
    }
    break;
  }
  case head:{
    static int cycleHeadLoops=maxDigit;
    clearDigits(maxDigit-cycleHeadLoops);
    setSwitchDigit(1,1);  
    if(--cycleHeadLoops<=0){
      cycleHeadLoops=maxDigit;
      setStatus(trans);
      return;
    }
    break;
  }
  case trans:{
    int len;
    char * code=encoder.getCode(digitN,len);
    
    Serial.print("cycle trans:");
    for(int i=0;i<len;i++){
      setDigit1(i+1,code[i]);
      Serial.print((int)code[i]);
      Serial.print(" ");
    }
    Serial.println("");
    setSwitchDigit(1,1);
    if(len<digitN){
      encoder.init(str);
      setStatus(loc);
      cycleLoops=0;
    }
    break;
  }
  default:
    return;
  }
};
void interactLoop(){};


int readKeyboard(){
  int ret=-1,val;
  for(int i=0;i<keyboardSize;i++){
    Serial.print(digitalRead(keyPin[i]));
    if(digitalRead(keyPin[i])==HIGH)  //由于本例检测沿触发，所以先检测输入是否低电平，
    {
      delay(10); //然后延时一段时间，
      if(digitalRead(keyPin[i])==LOW) //然后检测是不是电平变为高了。是的话，就是刚好按钮按下了。
      {
        delay(10);  //延时一段时间，防止按钮突然断开再按下。
        while(digitalRead(keyPin[i])==LOW) //判断按钮状态，如果仍然按下的话，等待松开。防止一直按住导致LED输出端连续反转
        {
          delay(1);
        }
        Serial.println(i);
        return i;
      }
    }
  }
  return ret;
}
