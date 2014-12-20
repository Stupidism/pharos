#pragma once
//common constants
const unsigned char w=4;    //width
const unsigned char maxDigit=8;
enum MStatus{loc,trans};
enum MMode{interact,cycle,test,rest};
const unsigned int cameraFPS=2;			
const unsigned int framePeriod = 1000/cameraFPS;
const unsigned char locateN=3;
const unsigned char locateI[locateN]={0,w-1,w-1};
const unsigned char locateJ[locateN]={w-1,0,w-1};
const unsigned char switchI=0;
const unsigned char switchJ=0;
//auduino constants
const int digit2light[maxDigit]={0,1,2,3,5,8,13,21};
const unsigned char ledPin[w][w]={{47,2,6,10},{46,3,7,11},{45,4,8,12},{44,5,9,13}};
const unsigned char locatePin[locateN]={ledPin[locateI[0]][locateJ[0]],ledPin[locateI[1]][locateJ[1]],ledPin[locateI[2]][locateJ[2]]};
const unsigned char switchPin=ledPin[switchI][switchJ];
const unsigned int transferPeriod = framePeriod+1;
//commone variables
unsigned char line;
unsigned char row;
unsigned char digit;
int digits[w][w];

MStatus stat=loc;
MMode mod=rest;
Timer timer;

//arduino variables

//test variables
struct index_digit_line_row{
  unsigned char row:2; 
  unsigned char line:2;
  unsigned char digit:3;
  unsigned char n:1;
} index1;
struct index_line_row_digit{
  unsigned char digit:3;
  unsigned char row:2; 
  unsigned char line:2;
  unsigned char n:1;
} index2;
unsigned char rand_index;
const unsigned char indexN=3;
unsigned char * index[indexN] ={(unsigned char *)&index1,(unsigned char *)&index2,(unsigned char *)&rand_index};
unsigned char test_idx=0;
unsigned char * p_index=index[test_idx];
