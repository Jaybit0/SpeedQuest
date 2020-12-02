
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
	}

	playerFinish(playername, score){
		var player = this.ps.findPlayerByName(playername);
		this.rm.playerFinish(player, score);
	}

	newTask(task){
		var returnMessage = new Object({
		packet: "taskassign",
		task: task
		});
		this.ss.sendMessage(returnMessage, null);
	}

}
