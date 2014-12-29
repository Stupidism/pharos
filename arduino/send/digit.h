#include <arduino.h>
#include "varibles.h"

void setDigit1(unsigned char num,unsigned int digit){
  *((int *)digits+num)=digit;
  unsigned char pin=*((unsigned char *)ledPin+num);
  unsigned char light=digit2light[digit];
  if(pin==switchPin)
    digitalWrite(pin,light);
  else
    analogWrite(pin,light);  
 
}

void setDigit(unsigned char line,unsigned char row,unsigned int digit){  
  digits[line][row]=digit;
  unsigned char pin=ledPin[line][row];
  unsigned char light=digit2light[digit];
  if(pin==switchPin)
    digitalWrite(pin,light);
  else
    analogWrite(pin,light);  
  /*
  Serial.print("setDigit:");
  Serial.print(line);
  Serial.print(" ");
  Serial.print(row);
  Serial.print(" ");
  Serial.println(light);/**/
}

void setSwitchDigit(bool autoSwitch,bool digit){
  if(autoSwitch)
    digits[switchI][switchJ]=!digits[switchI][switchJ];
  else
    digits[switchI][switchJ]=digit;
  
  Serial.print("setSwitchDigit:");
  Serial.print(autoSwitch);
  Serial.print(" ");
  Serial.print(digit);
  Serial.print(" ");
  Serial.print(digits[switchI][switchJ]);
  Serial.print(" ");
  Serial.println(digits[switchI][switchJ]);/**/
  digitalWrite(switchPin,digits[switchI][switchJ]);
}

void setLocateDigit(){
  for(int k=0;k<locateN;k++){
    setDigit(locateI[k],locateJ[k],maxDigit-1);
  }
  setSwitchDigit(false,true);
}

void clearDigits(unsigned char digit){
  Serial.print("clearDigits:");
  Serial.println(digit);/**/
  unsigned char light=digit2light[digit];
  for(int i=1;i<w*w;i++){
    unsigned char pin=*((unsigned char *)ledPin+i);
    //*((unsigned char *)digits+i)=digit;
    analogWrite(pin,light);  
  }
}
