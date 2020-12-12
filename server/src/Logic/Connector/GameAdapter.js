
module.exports = class GameAdapter{

	constructor(ss, gl, ps) {
		this.ss = ss;
		this.gl = gl;
		this.ps = ps;

		ss.on("receiveMessage", this.receiveMessage.bind(this));

		gl.on("updateScores", this.updateScores.bind(this));
		gl.on("finishGame", this.finishGame.bind(this));
		gl.on("startGame", this.startedGame.bind(this));
	}

	receiveMessage(message, playername){
		if(message.packet == "startgame"){
			this.startGame(playername, message.settings);
		}
	}

	startGame(playername, parameters){
		if(this.ps.findPlayerByName(playername).isHost)
			this.gl.startGame(parameters);
	}

	updateScores(scores){
		var returnMessage = new Object({
			packet: "taskfinish",
			roundscores: scores
		});
		this.ss.sendMessage(returnMessage, null);
	}

	startedGame(roundCount){
		this.sendStateUpdate("INGAME", roundCount);
	}

	finishGame(roundCount){
		this.sendStateUpdate("FINISHED", roundCount);
	}

	sendStateUpdate(gamestate, roundCount){
		var returnMessage = new Object({
			packet: "gamestate",
			gamestate: gamestate,
			roundcount: roundCount
		});
		this.ss.sendMessage(returnMessage, null);
	}
}
