#include "digit.h"
void setStatus(MStatus new_stat){
   clearDigits(0);
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
  setStatus(loc);
  mod=new_mod;
}
