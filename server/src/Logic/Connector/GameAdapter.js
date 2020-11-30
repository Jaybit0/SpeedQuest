
module.exports = class GameAdapter{

	constructor(ss, gl, ps) {
		this.ss = ss;
		this.gl = gl;
		this.ps = ps;

		ss.on("receiveMessage", this.receiveMessage.bind(this));
	}

	receiveMessage(message, playername){
		/*if("movestate" in message){
			if("rolldices" in message.movestate)
				this.rollDices(playername);
		}*/
	}

}
