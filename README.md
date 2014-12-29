pharos
======

Data transfer protocol based on visible light.

===============================================================================================
1.the structure of this project

./README.ME => this file

./docs/  => documents describe this projet
- glossary.txt
=> list of special words used in this project, explaining their meanings

./auduino/send/ => code files for arduino to control the leds and other moduls
- send.ino
- variables.h   => constants and variables used in arduino
- util.h 		=> functions like tools commonly used in many programs
- digit.h		=> functions to set the information represented by each LED
- control.h		=> functions to set status and mode

./android/ => code for android to read ,analyse and show the information contained in the light of the leds
