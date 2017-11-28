#pragma once
#include "API.h"
#include "Setup.h"
#include <Arduino.h>
#include <IPAddress.h>
#include <PubSubClient.h>
#include <TimeLib.h>

//###############################################################################
//  MQTT client
//###############################################################################
class MQTT {
public:
  MQTT(API &api);
  API &api;

  void setCallback(MQTT_CALLBACK_SIGNATURE);

  bool start();
  bool handle();
  // Callback Events
  // pubSubClient
  void on_incommingSubcribe(char *topic, byte *payload, unsigned int length);
  // API
  void on_pubMQTT(time_t t, Topic &topic);

  void pub(String topic, String value);

private:
  WiFiClient espClient;
  PubSubClient client;
};
