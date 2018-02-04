#pragma once

// Controller
#include "framework/Utils/Debug.h"
#include "framework/Core/Clock.h"
#include "framework/Core/ESP.h"
#include "framework/Core/FFS.h"
#include "framework/Utils/Logger.h"
#include "framework/Topic.h"
#include "framework/NET/WIFI.h"
#include "framework/Utils/SysUtils.h"
#include <ESP8266FtpServer.h>

// device specific
#include "device/Device.h"
#include "device/DeviceSetup.h"

//###############################################################################
//  BasicTemplate
//###############################################################################
class Controller {
public:
  // constructor
  Controller();

  // set the callback function for Topics
  void setTopicFunction(TopicFunction topicFn);

  void start();
  void handle();
  // Callback Events
    // WiFi
    void on_wifiConnected();
    void on_wifiDisconnected();
    //LAN
    void on_lanConnected();
    void on_lanDisconnected();
  //internal Events
  void on_netConnected();
  void on_netDisconnected();


  // the subsystems
  Clock clock;
  LOGGING logging;
  FFS ffs;
  WIFI wifi;
  FtpServer ftpSrv;
  ESP_Tools espTools;
  Device device;

  // the API
  String call(Topic &topic);

  // Timer
  void t_1s_Update();
  void t_short_Update();
  void t_long_Update();

  // deviceName
  String getDeviceName();

private:
  String deviceName;

  bool startConnections();
  void viewsUpdate(time_t t, Topic& topic);
  void handleEvent(String& topicsArgs);

  TopicQueue topicQueue;
  // if a new Topic is received this function is called
  TopicFunction topicFunction;
};
