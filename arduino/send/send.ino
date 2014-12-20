#include<string>
#include "Timer.h"
//width
const unsigned char w=4;
const unsigned char switchPin=47;
const unsigned char LEDS[w][w]={{switchPin,2,6,10},{46,3,7,11},{45,4,8,12},{44,5,9,13}};

const unsigned char maxDigit=8;
int digit2light[maxDigit]={0,1,2,3,5,8,13,21};
int digits[w][w];

struct index_light_line_row{
  unsigned char row:2; 
  unsigned char line:2;
  unsigned char digit:4;
} index;
char * p_index =(char *)&index;

unsigned char line;
unsigned char row;
unsigned char digit;

Timer timer;
const int framePeriod=500+1;

void setup() {
  pinMode(switchPin,OUTPUT);
  digitalWrite(47,HIGH);
  Serial.begin(9600);
  clearDigit(0);
  *p_index=(1<<4)+1;
  timer.every(framePeriod,cyclicalLoop);  
}

void loop() {
  if(Serial.available()){
    line=serReadInt();
    row=serReadInt();
    digit=serReadInt();
    setDigit(line,row,digit);
  }
  timer.update();
}

void cyclicalLoop(){
  setDigit(index.line,index.row,index.digit);
  switchFrame();
  (*p_index)++;
  if(index.digit>=maxDigit)
    *p_index=(1<<4)+1;
}

void clearDigit(unsigned char digit){
  for(int i=0;i<w;i++){
    for(int j=0;j<w;j++){
      setDigit(i,j,digit);
    }
  }
}

void switchFrame(){
  digits[0][0]=!digits[0][0];
  digitalWrite(switchPin,digits[0][0]);
}

void setDigit(unsigned char line,unsigned char row,unsigned int digit){  
  Serial.print("set light:");
  Serial.print(line);
  Serial.print(" ");
  Serial.print(row);
  Serial.print(" ");
  Serial.println(digit);
  digits[line][row]=digit;
  unsigned char pin=LEDS[line][row];
  unsigned char light=digit2light[digit];
  if(pin==switchPin)
    digitalWrite(pin,light);
  else
    analogWrite(pin,light);  
}


//read an integer from serial, stop at space
int serReadInt()
{
 int i, serAva;                           // i is a counter, serAva hold number of serial available
 char inputBytes [7];                 // Array hold input bytes
 char * inputBytesPtr = &inputBytes[0];  // Pointer to the first element of the array
     
 if (Serial.available()>0)            // Check to see if there are any serial input
 {
   delay(5);                              // Delay for terminal to finish transmitted
                                              // 5mS work great for 9600 baud (increase this number for slower baud)
   serAva = Serial.available();  // Read number of input bytes
   for (i=0; i<serAva; i++){     // Load input bytes into array
     inputBytes[i] = Serial.read();
     if(inputBytes[i]== ' ')
       break;
   }
   inputBytes[i] =  '\0';             // Put NULL character at the end
   return atoi(inputBytesPtr);    // Call atoi function and return result
 }
 else
   return -1;                           // Return -1 if there is no input
}
