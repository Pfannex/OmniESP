#include "module_x.h"
#include <Arduino.h>

//===============================================================================
//  GPIO
//===============================================================================
module_x::module_x(LOGGING &logging, TopicQueue &topicQueue)
    : logging(logging), topicQueue(topicQueue) {}


//-------------------------------------------------------------------------------
//  GPIO public
//-------------------------------------------------------------------------------
//...............................................................................
// start
//...............................................................................
void module_x::start() {

  logging.info("starting GPIO");

}

//...............................................................................
// handle
//...............................................................................
void module_x::handle() {
  unsigned long now = millis();

}

//...............................................................................
//  GPIO set
//...............................................................................
String module_x::set(Topic &topic) {
  /*
  ~/set
    └─gpio
        └─led (on, off, blink)
  */

  logging.debug("GPIO set topic " + topic.topic_asString() + " to " +
                topic.arg_asString());

  if (topic.itemIs(3, "led")) {
    return TOPIC_OK;
  } else {
    return TOPIC_NO;
  }
}
//...............................................................................
//  GPIO get
//...............................................................................
String module_x::get(Topic &topic) {
  /*
  ~/get
    └─gpio
        └─led (on, off, blink)
  */

  logging.debug("GPIO get topic " + topic.topic_asString() + " to " +
                topic.arg_asString());

  if (topic.itemIs(3, "led")) {
    return TOPIC_OK;
  } else {
    return TOPIC_NO;
  }
}
//...............................................................................
//  GPIO get
//...............................................................................
void module_x::on_events(Topic &topic){
  //Serial.println(topic.asString());
}
//-------------------------------------------------------------------------------
//  GPIO private
//-------------------------------------------------------------------------------