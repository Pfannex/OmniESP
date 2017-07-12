#pragma once
#include <Arduino.h>
#include <string.h>

//###############################################################################
//  Topic
//###############################################################################
typedef char* string;

class Topic{
public:
  //Topic(String topic_asString, String arg_asString);
  Topic(char* topics, char* args);
  ~Topic();

  char* topics;
  char* args;

  string* item;
  int countItems = 0;
  string* arg;
  int countArgs = 0;

//to function
  String topic_asString;
  String arg_asString;
  String asString;

  void dissectTopic();
  String deleteTopicItem(int item);


private:
  void printTopic();
};

//###############################################################################
//  API types
//###############################################################################
struct TTopic{
};
