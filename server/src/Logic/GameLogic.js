
const EventEmitter = require('events');
const GameUtil = require('./GameUtil.js');
const GameSelector = require('./GameSelector.js');

module.exports = class GameLogic extends EventEmitter{
  constructor(ps, rm){
    super();
    this.ps = ps;
    this.rm = rm;
    this.plaiedGames = new Map();
    var games = GameUtil.readGames();
    this.gs = new GameSelector(games);

  	rm.on("finishTask", this.finishRound.bind(this));
  }

  startGame(parameters){
    this.roundCount = parameters.roundcount;
    this.gameTasks = this.gs.generateTasks(this.roundCount);
    this.currentRound = 0;
    this.ps.resetScores();
    this.emit("startGame");
    this.nextRound();
  }

  nextRound(){
    if(this.roundCount <= this.currentRound){
      this.emit("finishGame");
      return;
    }
    var task = this.gameTasks[this.currentRound];
    this.currentRound++;

    setTimeout(() => {this.rm.newRound(this.ps.countOnlinePlayers(), task, this.currentRound)}, 3000);
  }

  finishRound(scores){
    var updatedPlayers = this.ps.addScores(scores);
    this.emit("updateScores", updatedPlayers);
    this.nextRound();
  }

}
