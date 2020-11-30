const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');


module.exports = class HttpServer{
	constructor(app, tm, gm) {
		this.tm = tm;
		this.gm = gm;
		app.use(bodyParser.json()); // support json encoded bodies
		app.use(bodyParser.urlencoded({ extended: true }));

		app.use(express.static('webapp'));

		app.get('/', (req, res) => {
			res.sendFile(path.resolve('webapp/start.html'));
		});
		app.get('/gamelink', (req, res) => {
			res.sendFile(path.resolve('webapp/start.html'));
		});
		app.get('/game', (req, res) => {
			res.sendFile(path.resolve('webapp/game.html'));
		});
		app.post('/join', this.joinReq.bind(this));
	}

	async joinReq(req, res){
		var key = null;
		if("key" in req.body && req.body.key != null && req.body.key.length == 4)
			key = req.body.key;
		else
			key = this.makeKey(4);
			
    var name = this.gm.getGame(key).newPlayer(req.body.name);
		var token = this.tm.createToken(name, key);
		res.redirect("/game?token=" + token);
	}

	makeKey(length) {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}

}
