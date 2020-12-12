'use strict';
const WebSocket = require('ws');
const Url = require('url');

module.exports = class SocketServer{
	constructor(wss, tm, gm) {
		this.wss = wss;
		this.tm = tm;
		this.gm = gm;
		wss.on('connection', this.connect.bind(this));

		this.interval = setInterval(() => {
			this.wss.clients.forEach(function each(ws) {
				if (ws.isAlive === false) return ws.terminate();

				ws.isAlive = false;
				ws.ping(() => {});
			});
		}, 30000);
		this.wss.on('close', () => {
			clearInterval(this.interval);
		});
	}

	connect(ws, request){
		var obj = this.verify(request);
		if(obj == null){
			ws.close();
			console.log(`Invalid token`);
			return;
		}
		ws.isAlive = true;
	  ws.on('pong', this.heartbeat);

		this.gm.getGame(obj.key).playerConnect(ws, obj.userId);
	}

  verify(request){
    var wsurl = Url.parse(request.url);
		var params = new URLSearchParams(wsurl.query);
		if(params.has("token")){
			var token = params.get("token");
			return this.tm.verifyToken(token);
		}else if(params.has("name") && params.has("gamekey")){
			var gamekey = this.gm.verifyKey(params.get("gamekey"));
			var name = params.get("name");
 			var name = this.gm.getGame(gamekey).newPlayer(name);
			return new Object({userId: name, key: gamekey});
		}else {
			return null;
		}
  }


	heartbeat() {
	  this.isAlive = true;
	}

}
