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

		var key = this.gm.verifyKey(req.body.key);
    var name = this.gm.getGame(key).newPlayer(req.body.name);
		var token = this.tm.createToken(name, key);
		res.redirect("/game?token=" + token);
	}

}
