

module.exports = class PlayerAdapter{
	//var wss = null;wss, tm, ps
	constructor(ss, ps) {
		this.ss = ss;
		this.ps = ps;

		ss.on('playerStateChanged', this.updatePlayerState.bind(this));
		ss.on("receiveMessage", this.receiveMessage.bind(this));

		ps.on('newPlayer', this.updatePlayer.bind(this));
		ps.on('updatePlayer', this.updatePlayer.bind(this));
		ps.on('updatePlayers', this.updatePlayers.bind(this));
	}

	receiveMessage(message, playername){
		/*if("playerlist" in message){
			if("endgame" in message.playerlist)
				this.ps.endGame();
		}*/
	}

	updatePlayers(players){
		this.updatePlayers(players);
	}

	updatePlayer(player){
		this.updatePlayers([player]);
	}

	updatePlayers(players, updatetyp){
		var returnMessage = new Object({
		packet: "playerupdate",
		updateplayers: players
		});
		this.ss.sendMessage(returnMessage, null);
	}

	updatePlayerState(playername, state){
		this.ps.updatePlayerState(new Object({name: playername}), state);
	}

}
