'use strict';
const EventEmitter = require('events');
const fs = require('fs');

module.exports = class PlayerService extends EventEmitter{
	constructor() {
		super();
		this.players = [];
	}

	loadPlayer(newname){
    if(newname == null || newname.length == 0)
      newname = "Hund";
    var result = this.validateName(newname);

    if(result.index == -1)
      this.addPlayer(result.name);

		return result.name;
	}

  validateName(newname){
    var index = this.players.findIndex(x => x.name === newname);
    if(index != -1 && this.players[index].state > 0){
      newname = newname + "2";
      var result = this.validateName(newname);
      newname = result.name;
      index = result.index;
    }
    return new Object({name: newname, index: index});
  }

  addPlayer(newname){
		var pickedcolor = this.pickColor();
		var firstPlayer = this.players.length == 0;

    var player = new Object({name: newname, state: 0, color: pickedcolor, score: 0, isHost: firstPlayer});
    this.players.push(player);

    this.emit("newPlayer", player);
  }

	pickColor(){
		let rawdata = fs.readFileSync('./config/colors.json');
		let colors = JSON.parse(rawdata).colors;
		return colors[this.players.length];
	}

	updatePlayerState(player, state){
		const index = this.players.findIndex(x => x.name === player.name);
		if(index === -1)
			throw "Invalid player";

		this.players[index].state = state;
		this.emit("updatePlayer", this.players[index]);

		if(state == 1)
			this.emit("updatePlayerConn", this.players[index]);
	}

	findPlayerByName(playername){
		var index = this.players.findIndex(x => x.name === playername);
		return this.players[index];
	}

	updateScore(player, addScore){
		const index = this.players.findIndex(x => x.name === player.name);
		if(index == -1)
			return;
		player.score = player.score + addScore;
	}

	countOnlinePlayers(){
		return this.getOnlinePlayers().length;
	}

	getOnlinePlayers(){
		return this.players.filter(x => x.state > 0);
	}

	addScores(scores){
		var updatePlayers = scores.map(item => {
			var player = item.player;
			player.score+= item.score;
			return player;
		});
		return updatePlayers;
	}

	resetScores(){
		this.players.forEach(player => player.score = 0);
	}
}
