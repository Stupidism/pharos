#include "digit.h"
void setStatus(MStatus new_stat){
  Serial.print("setStatus");
  Serial.print(" ");
  Serial.println(new_stat);
  switch(stat){
  case loc:
    setLocateDigit();
    break;
  case head:  
    break;
  case trans:
    break;
  default:
    return;
  } 
  stat=new_stat;
}

void setMode(MMode new_mod){
  switch(new_mod){
  case interact:
  case cycle:
  case test:
    test_idx=0;
    p_index=index[test_idx];
    *p_index=1<<4;
  case rest:
    break;
  default:
    return;
  }
  Serial.print("changeMode ");
  Serial.println(new_mod);
  clearDigits(0);
  setSwitchDigit(false,false);
  setStatus(loc);
  mod=new_mod;
}
