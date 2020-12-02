
module.exports = class GameAdapter{

	constructor(ss, gl, ps) {
		this.ss = ss;
		this.gl = gl;
		this.ps = ps;

		ss.on("receiveMessage", this.receiveMessage.bind(this));

		gl.on("updateIngame", this.updateIngame.bind(this));
		gl.on("finishGame", this.finishGame.bind(this));
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

	updateIngame(roundNumber, scores){
		this.sendUpdate("INGAME", roundNumber, scores);
	}

	finishGame(roundNumber, scores){
		this.sendUpdate("FINISHED", roundNumber, scores);
	}

	sendUpdate(gamestate, roundNumber, scores){
		console.log(scores);
		var returnMessage = new Object({
			packet: "gamestate",
			gamestate: gamestate,
			round: roundNumber,
			updateplayers: scores
		});
		this.ss.sendMessage(returnMessage, null);
	}
}
