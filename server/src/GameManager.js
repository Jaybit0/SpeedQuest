
const Game = require('./Logic/Game.js');

module.exports = class GameManager{
  constructor(){
    this.game = null;
    this.games = new Map();
  }

  getGame(key){
    console.log("Get game for:" + key);
    var game = this.games.get(key);
    if(game == null)
      game = this.createGame(key);

    return game;
  }

  createGame(key){
    console.log("Create game for:" + key);
    var game = new Game(key);
    game.on("resetGame", this.resetGame.bind(this, key));
    this.games.set(key, game);
    return game;
  }

  resetGame(key){
    this.games.delete(key);
  }

	verifyKey(key){
		if(key == null || key.length != 4)
			key = this.makeKey(4);
		else
			key = key.toUpperCase();

		return key;
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
