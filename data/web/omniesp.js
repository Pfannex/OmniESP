"use strict";var debug=1,log=1;function debugmsg(e){debug&&console.log("DEBUG: "+e)}function logmsg(e){log&&console.log("LOG  : "+e)}function login(){return username=$("#username").val(),password=$("#password").val(),$.ajax({type:"POST",url:"./auth.html",data:"action=login&username="+username+"&password="+password,success:function(e){"true"==e?window.location="/":$("#failed").popup("open")}}),!1}function logout(){return $.ajax({type:"POST",url:"./auth.html",data:"action=logout",success:function(e){window.location="/"}}),!1}var widgets,muteDashboardActions=0;function dashboardAddContent(e,n){debugmsg(n),$("#dashboard div.ui-collapsible-content").append(n).trigger("create")}function dashboardAddControlgroup(e){var n,t=e.legend,o=e.name,i=e.data,a="\x3c!-- widget: controlgroup "+o+' --\x3e\n<div class="ui-field-contain">\n<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" onChange="dashboardAction(\''+o+"')\">\n<legend>"+t+"</legend>\n";for(n=0;n<i.length;n++){var s=i[n].label,c=i[n].value,l=o+"-"+c;logmsg(" with label "+s+", value "+c),a+='<input name="'+o+'" id="'+l+'" value="'+c+'" type="radio"/>\n',a+='<label for="'+l+'">'+s+"</label>\n"}dashboardAddContent(e,a+="</fieldset>\n</div>\n")}function dashboardAddText(e){var n=e.legend,t=e.name;e.data;dashboardAddContent(e,"\x3c!-- widget: text "+t+' --\x3e\n<div class="ui-field-contain">\n<label for="'+t+'">'+n+'</label>\n<input type="'+e.inputtype+'" data-mini="true" id="'+t+'" value="" '+(e.readonly?"readonly ":"")+"onChange=\"dashboardAction('"+t+"')\">\n</div>\n")}function retrieveDashboard(e){return logmsg("Retrieving dashboard from device..."),call("~/get/ffs/webCFG/root",e)}function dashboardBuild(e){var n;for(logmsg("Building dashboard..."),debugmsg(e),widgets=JSON.parse(e),n=0;n<widgets.length;n++){var t=widgets[n];switch(t.type){case"controlgroup":dashboardAddControlgroup(t);break;case"text":dashboardAddText(t);break;default:logmsg("Unknown widget type "+t.type)}}logmsg("Dashboard ready.")}function dashboardAction(e){var n;if(!muteDashboardActions)for(n=0;n<widgets.length;n++)if(widgets[n].name==e){var t=widgets[n];if(""!=t.action)switch(t.type){case"controlgroup":var o=getRadio(t.name);t.action&&call(t.action+" "+o),logmsg("controlgroup "+e+" has changed to "+o);break;case"text":logmsg("text "+e+" has changed to "+(o=getText(t.name))),t.action&&call(t.action+" "+o);break;default:logmsg("Unknown widget type "+t.type)}break}}function dashboardEvalEvent(e,n){muteDashboardActions=1;var t,o=e.join("/");for(t=0;t<widgets.length;t++)if(widgets[t].event==o){var i=widgets[t];switch(i.type){case"controlgroup":setRadio(i.name,n);break;case"text":setText(i.name,n);break;default:logmsg("Unknown widget type "+i.type)}break}muteDashboardActions=0}function handleDashboardClick(e){"checkbox"==e.type?debugmsg("checkbox "+e.checked):"number"==e.type&&debugmsg("number "+e.value),e.checkValidity()?debugmsg("Valid"):debugmsg("INVALID!")}var connection,withLog=0,mustScroll=[1,1],lines=[0,0],timers=Object.create(null);function consoleSet(e,n){$("#console"+e).html(n)}function consoleScroll(e){var n=$("#console"+e)[0].scrollHeight;$("#console"+e).scrollTop(n)}function consoleWriteln(e,n){var t=new Date;if(lines[e]++,250<lines[e]){var o=$("#console"+e).text();$("#console"+e).text(o.substring(o.indexOf("\n")+1))}$("#console"+e).append(t.toLocaleString()+" "+n+"\n"),mustScroll[e]&&consoleScroll(e)}function consoleClear(e){consoleSet(e,"")}function consSetScrollFunction(e){mustScroll[e]=1;var n=$("#console"+e);n.scroll(function(){n[0].scrollHeight-n.scrollTop()<=n.outerHeight()+2?mustScroll[e]||(mustScroll[e]=1):mustScroll[e]&&(mustScroll[e]=0)})}function consStart(){logmsg("Starting consoles..."),consSetScrollFunction(0),consSetScrollFunction(1)}function consAddReadings(e){var n=e+"_r",t="<div class='ui-grid-b' id='"+n+"'></div>",o=$("#"+e+" div.ui-collapsible-content").filter(":first").prepend(t);return o.id=n,o}function consColorReading(e,n){$("#"+e+"_t").css("color",n),$("#"+e).css("color",n),$("#"+e+"_v").css("color",n)}function consAddReading(e,n,t){var o="<div class='ui-block-a'><div class='ui-bar ui-bar-a' id='"+n+"_t'>?</div></div><div class='ui-block-b'><div class='ui-bar ui-bar-a' id='"+n+"'>"+t+"</div></div><div class='ui-block-c'><div class='ui-bar ui-bar-a' id='"+n+"_v'>?</div></div>",i=$("#"+e).append(o);return i.id=n,$("#"+e).trigger("refresh"),i}function consSetReading(e,n,t){$("#"+e+"_t").text(n),t?$("#"+e+"_v").text(t):$("#"+e+"_v").html("&nbsp;"),clearTimeout(timers[e]),consColorReading(e,"red"),timers[e]=setTimeout(function(){consColorReading(e,"black")},2500)}function consAddNode(e,n,t){var o="<div data-role='collapsible' data-collapsed='false' id='"+n+"'><h3>"+t+"</h3></div>",i=$("#"+e+" div.ui-collapsible-content").filter(":first").append(o);return i.id=n,i.trigger("create"),i}function consEvalEvent(e,n,t){var o,i="readings";for(o=2;o<n.length;o++){var a=n[o],s=i;if(i+="_"+a,null==document.getElementById(i))if(o<n.length-1)consAddNode(s,i,a);else{var c=s+"_r";null==document.getElementById(c)&&consAddReadings(s),consAddReading(c,i,a)}o==n.length-1&&consSetReading(i,e,t)}}function showDetails(e,n,t){var o=$("#"+e);n.val().match(t)?o.show():o.hide()}function setRadioHandlers(){logmsg("Setting radio handlers..."),$(document).on("change","input[name=wifi]",function(){showDetails("wifi_net_details",$(this),"manual"),showDetails("wifi_details",$(this),"dhcp|manual")}),$(document).on("change","input[name=lan]",function(){showDetails("lan_net_details",$(this),"manual")}),$(document).on("change","input[name=ntp]",function(){showDetails("ntp_details",$(this),"on")}),$(document).on("change","input[name=mqtt]",function(){showDetails("mqtt_details",$(this),"on")})}function ping(){$.ajax({url:"/",success:function(e){window.location.href="/"}})}function reloadIfAlive(){logmsg("reload if alive..."),setInterval(ping,3e3)}function reboot(){$("#popupRebooting").popup("open"),call("~/set/esp/restart"),reloadIfAlive()}function setTime(){call("~/set/clock/forceNTPUpdate")}function update(){var e=$("#update_localpath").prop("files")[0];e&&(logmsg("Uploading "+e.name+" ("+e.size+" bytes)"),$.ajax({type:"POST",url:"/update.html",cache:!1,contentType:!1,processData:!1,data:new FormData($("#update_form")[0]),success:function(e){logmsg("firmware update: "+e),"ok"==e?$("#popupUpdateOk").popup("open"):($("#update_error").html(e),$("#popupUpdateFail").popup("open"))}}))}function call(e,t){logmsg("API async call "+e),$.post("/api.html","call="+e,function(e,n){logmsg("API async result: "+e),t&&t(e)},"text")}function retrieveConfig(e){return logmsg("Retrieving configuration from device..."),call("~/get/ffs/cfg/root",e)}function saveConfig(){logmsg("Saving configuration in device..."),call("~/set/ffs/cfg/saveFile")}function sendConfig(e){logmsg("Sending configuration to device..."),call("~/set/ffs/cfg/root "+e,saveConfig)}function setText(e,n){$("#"+e).filter(":input").val(n)}function setRadio(e,n){var t=$('input:radio[name="'+e+'"]'),o=t.filter('[value="'+n+'"]');o.prop("checked",!0),t.checkboxradio("refresh"),o.trigger("change")}function setConfig(e){logmsg("Setting inputs from configuration...");var n=JSON.parse(e),t=$("#config");t.find("input:text").val(function(){return n[this.name]}),t.find("input:password").val(function(){return n[this.name]}),setRadio("wifi",n.wifi),setRadio("lan",n.lan),setRadio("ntp",n.ntp),setRadio("update",n.update),setRadio("mqtt",n.mqtt)}function getRadio(e){return $('input:radio[name="'+e+'"]:checked').val()}function getText(e,n){return $("#"+e).filter(":input").val()}function getConfig(){logmsg("Getting configuration from inputs...");var e={},n=$("#config");return n.find("input:text").each(function(){e[$(this).attr("id")]=$(this).val()}),n.find("input:password").each(function(){e[$(this).attr("id")]=$(this).val()}),e.wifi=getRadio("wifi"),e.lan=getRadio("lan"),e.ntp=getRadio("ntp"),e.update=getRadio("update"),e.mqtt=getRadio("mqtt"),JSON.stringify(e)}function apply(){sendConfig(getConfig())}function message(e){debugmsg(window.status=e)}function message_clear(){message("")}$(document).ready(function(){consStart(),startListener()}),$(document).on("pagecreate","#page1",function(e,n){logmsg("Initializing dashboard...");retrieveDashboard(dashboardBuild)}),$(document).on("pagecreate","#page2",function(e,n){logmsg("Initializing configuration page..."),setRadioHandlers();retrieveConfig(setConfig)});var lastIndex=0;function startListener(){logmsg("Opening connection..."),setTimeout(openConnection,1e3)}function openConnection(){message_clear();var e="ws://"+window.location.href.split("/")[2]+"/ws";connection&&connection.close(),logmsg("Connecting to "+e+"..."),(connection=new WebSocket(e)).onclose=connection.onerror=connection.onmessage=updateListener}function closeConnection(){connection&&("function"==typeof connection.close?connection.close():"function"==typeof connection.abort&&connection.abort(),connection=void 0)}function updateListener(e){var n="Connection lost, trying to reconnect every 5 seconds.",t="";if(("function"==typeof WebSocket||"object"==typeof WebSocket)&&e&&e.target instanceof WebSocket){if("close"==e.type)return message(n),closeConnection(),void setTimeout(openConnection,5e3);t=e.data,lastIndex=0}else{if(4==connection.readyState)return message(n),void setTimeout(openConnection,5e3);if(3!=connection.readyState)return;var o=connection.responseText.length;if(lastIndex==o)return;t=connection.responseText.substring(lastIndex,o),lastIndex=o}null!=t&&0!=t.length&&(message("data received"),dispatchContent(t))}function dispatchContent(e){var n=JSON.parse(e);if("event"==n.type){consoleWriteln(0,n.value);var t=new Date,o=n.value.split(" "),i=o[0].split("/");i.shift(),i.unshift("~"),o.shift();var a=0<o.length?o.join(" "):"";consEvalEvent(t.toLocaleString(),i,a),dashboardEvalEvent(i,a)}else"log"==n.type&&consoleWriteln(1,n.subtype+" "+n.value)}