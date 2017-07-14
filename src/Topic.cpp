#include "Topic.h"

//###############################################################################
//  data exchange Topic
//###############################################################################
Topic::Topic(String& topicsArgs) {
//topics
  String str = topicsArgs.substring(0, topicsArgs.indexOf(" "));
  topics= new char[str.length()];
  strcpy(topics, str.c_str());
//args
  str = topicsArgs.substring(topicsArgs.indexOf(" ")+1);
  args = new char[str.length()];
  strcpy(args, str.c_str());

  item = nullptr;
  arg = nullptr;
  dissectTopic(topics, args);
}

Topic::Topic(char* topics, char* args) {
  item = nullptr;
  arg = nullptr;
  dissectTopic(topics, args);
}
Topic::~Topic(){
  if (item != NULL) delete[] item;
  if (arg != NULL)  delete[] arg;
  if (topics != NULL)  delete[] topics;
}

//-------------------------------------------------------------------------------
//  Topic public
//-------------------------------------------------------------------------------
//...............................................................................
//  Topic strings
//...............................................................................
String topic_asString(){
  return "";
}
String arg_asString(){
  return "";

}
String asString(){
  return "";

}
//...............................................................................
//  dissect Topic
//...............................................................................
void Topic::dissectTopic(char* topics, char* args){
  //Serial.println(topics);
  //Serial.println(args);

//clean up topics & args
  while (topics[strlen(topics) - 1] == '/')
    topics[strlen(topics) - 1] = '\0';
  while (args[strlen(args) - 1] == ',')
    args[strlen(args) - 1] = '\0';
  while (args[0] == ','){
    for (size_t i = 0; i < strlen(args); i++) {
      args[0] = args[1];
    }
    args[strlen(args) - 1] = '\0';
  }

  char* ch;
//topics
  if(*topics) {
    ch= topics;
    countItems= 1;
    while(*ch) if(*ch++ == '/') countItems++;
    item = new string[countItems];

    if (countItems == 1) {
      item[0] = topics;
    }else{
      int i= 0;
      item[i] = strtok(topics, "/");
      while(item[i++] != NULL) {
        //printf("%s\n", ptr);
     	  item[i] = strtok(NULL, "/");
      }
    }
  }
//args
  if(*args) {
    ch= args;
    countArgs= 1;
    if (isValidJson(String(args))) {
      arg = new string[1];
      arg[0] = args;
    }else{
      while(*ch) if(*ch++ == ',') countArgs++;
      arg = new string[countArgs];

      if (countArgs == 1) {
        arg[0] = args;
      }else{
        int i= 0;
        arg[i] = strtok(args, ",");
        while(arg[i++] != NULL) {
     	  arg[i] = strtok(NULL, ",");
        }
      }
    }
  }
}

//...............................................................................
//  delete TopicItem in return String
//...............................................................................
String Topic::modifyTopic(int index){
  String str = "";

  for (int i = 0; i < countItems; i++) {
    if (i != index) {
      str += String(item[i]);
      if (i != countItems-1) {
        str += "/";
      }
    }
  }
  return str;
}

//...............................................................................
//  compare topic.item by index with string
//...............................................................................
bool Topic::itemIs(int index, string topicName){
  if (index < countItems)
    return !strcmp(item[index], topicName);
  else
    return false;
}

//-------------------------------------------------------------------------------
//  Topic private
//-------------------------------------------------------------------------------
//...............................................................................
//  check for valid JSON-String
//...............................................................................
bool Topic::isValidJson(String root){
  DynamicJsonBuffer jsonBuffer;
  JsonObject& json = jsonBuffer.parseObject(root);
  return json.success();
}

//...............................................................................
//  print Topic
//...............................................................................
void Topic::printTopic(){
  Serial.println("............................................");
  for (int i = 0; i < countItems; i++) {
    Serial.println(item[i]);
  }
  for (int i = 0; i < countArgs; i++) {
    Serial.println(arg[i]);
  }
  Serial.println("............................................");
}
