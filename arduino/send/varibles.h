#pragma once
//common constants
const unsigned char w=4;    //width
const unsigned char digitBitN=3;
const unsigned char digitN=w*w-1;
const unsigned char maxDigit=1<<digitBitN;
enum MStatus{loc,head,trans};
enum MMode{interact,cycle,test,rest};
const unsigned int cameraFPS=2;			
const unsigned int framePeriod = 1000/cameraFPS;
const unsigned char locateN=3;
const unsigned char locateI[locateN]={0,w-1,w-1};
const unsigned char locateJ[locateN]={w-1,0,w-1};
const unsigned char switchI=0;
const unsigned char switchJ=0;
//auduino constants
const int digit2light[maxDigit]={0,8,13,21,34,55,89,144};
const unsigned char ledPin[w][w]={{47,2,6,10},{46,3,7,11},{45,4,8,12},{44,5,9,13}};
const unsigned char locatePin[locateN]={ledPin[locateI[0]][locateJ[0]],ledPin[locateI[1]][locateJ[1]],ledPin[locateI[2]][locateJ[2]]};
const unsigned char switchPin=ledPin[switchI][switchJ];
const unsigned int transferPeriod = framePeriod+1;
//commone variables
unsigned char num;
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

unsigned char book[123]={0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,3,4,5,6,7,8,9,10,11,0,0,0,0,0,0,0,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,0,0,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37};
