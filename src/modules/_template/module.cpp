#include "module.h"
#include <Arduino.h>

//===============================================================================
//  myModule
//===============================================================================
myModule::myModule(string name, LOGGING &logging, TopicQueue &topicQueue)
          : Module(name, logging, topicQueue)
          {}

//-------------------------------------------------------------------------------
//  myModule public
//-------------------------------------------------------------------------------
//...............................................................................
// start
//...............................................................................
void myModule::start() {
  Module::start();

  //start your routines here

}

//...............................................................................
// handle
//...............................................................................
void myModule::handle() {
  Module::handle();

  //handle your routines here
}

//...............................................................................
// getVersion
//...............................................................................
String myModule::getVersion() {
  return  String(myModule_Name) + " v" + String(myModule_Version);
}

//-------------------------------------------------------------------------------
//  QRE1113 private
//-------------------------------------------------------------------------------
