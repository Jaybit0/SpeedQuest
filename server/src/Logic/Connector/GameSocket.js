'use strict';
const EventEmitter = require('events');
const WebSocket = require('ws');
const Url = require('url');

module.exports = class GameSocket extends EventEmitter{
	//var wss = null;wss, tm, ps
	constructor() {
		super();
    this.clients = [];
	}

	connect(ws, name){
    ws.userId = name;
    this.clients.push(ws);
		ws.on('message', this.message.bind(this, ws));
		ws.on('close', this.disconnect.bind(this, ws));
    this.emit("playerStateChanged", name, 1);
	}
  
	message(ws, data){
		var messageObj;
		try {
			messageObj = JSON.parse(data);
			if(typeof(messageObj) != "object")
				throw "no object type";
		} catch (e) {
			console.log(`Invalid Mesage from ${ws.userId}: '${data}' '${typeof data}'`);
			return;
		}
		this.emit("receiveMessage", messageObj, ws.userId);
	}

	disconnect(ws, data){
    const index = this.clients.findIndex(x => x.userId == ws.userId);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
    this.emit("playerStateChanged", ws.userId, 0);
	}

  sendMessage(message, targets){
    var strMessage = JSON.stringify(message);
		console.log(strMessage+ "    " + JSON.stringify(targets));
    //Group
    if(targets == null){
      this.clients.forEach(function(ws) {
        ws.send(strMessage);
      });
    }else if (Array.isArray(targets)){  //All
      this.clients.forEach(function(ws) {
  			var userIndex = targets.findIndex(x => x.name === ws.userId);
  			if(userIndex > -1)
          ws.send(strMessage);
      });
    }else{
      this.clients.forEach(function(ws) {
        if (ws.userId == targets.name)
          ws.send(strMessage);
      });
    }
  }

}
