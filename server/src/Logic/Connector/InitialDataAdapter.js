
module.exports = class InitialDataAdapter{
	//var wss = null;wss, tm, ps
	constructor(ss, ps, gl, gamekey) {
		this.gamekey = gamekey;
		this.ss = ss;
		this.ps = ps;
		this.gl = gl;

    //ps.on('updatePlayer', this.newPlayerState.bind(this));
		ps.on('updatePlayerConn', this.newPlayerState.bind(this));
  }

  newPlayerState(player){
			var controllstate = player.isCurrPlayer ? 1 : 0;
      var returnMessage = new Object({
				packet: "initial",
				gamekey: this.gamekey,
        userself: player,
        playerlist: this.ps.players
      });
      this.ss.sendMessage(returnMessage, player);
  }
}
