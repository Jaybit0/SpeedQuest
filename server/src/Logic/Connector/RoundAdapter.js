
module.exports = class RoundAdapter{

	constructor(ss, rm, ps) {
		this.ss = ss;
		this.rm = rm;
		this.ps = ps;

		ss.on("receiveMessage", this.receiveMessage.bind(this));

		rm.on("newTask", this.newTask.bind(this));
	}

	receiveMessage(message, playername){
		if(message.packet == "taskinfo"){
			if(message.taskdone)
				this.playerFinish(playername, message.rating);
		}
		if(message.packet == "forward" && "payload" in message){
				this.sendForward(playername, message.payload);
		}
	}

	sendForward(payload, playername){
		var returnMessage = new Object({
		packet: "forward",
		sender: playername,
		payload: payload
		});
		this.ss.sendMessage(returnMessage, null);
	}

	playerFinish(playername, score){
		var player = this.ps.findPlayerByName(playername);
		this.rm.playerFinish(player, score);
	}

	newTask(task, round){
		var returnMessage = new Object({
		packet: "taskassign",
		round: round,
		task: task
		});
		this.ss.sendMessage(returnMessage, null);
	}

}
