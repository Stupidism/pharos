#include <arduino.h>
#include "varibles.h"
void setDigit(unsigned char line,unsigned char row,unsigned int digit){  
/*  
  Serial.print("setDigit:");
  Serial.print(line);
  Serial.print(" ");
  Serial.print(row);
  Serial.print(" ");
  Serial.println(digit);
*/
  digits[line][row]=digit;
  unsigned char pin=ledPin[line][row];
  unsigned char light=digit2light[digit];
  if(pin==switchPin)
    digitalWrite(pin,light);
  else
    analogWrite(pin,light);  
}

void setLocateDigit(){
  unsigned char digit=digits[locateI[0]][locateJ[0]]?0:255;
  for(int k=0;k<locateN;k++){
    setDigit(locateI[k],locateJ[k],digit);
  }
}

void setSwitchDigit(){
  setDigit(switchI,switchJ,!digits[switchI][switchJ]);
}

void clearDigits(unsigned char digit){
  for(int i=0;i<w;i++){
    for(int j=0;j<w;j++){
      setDigit(i,j,digit);
    }
  }
}
