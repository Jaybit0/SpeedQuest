
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
    this.nextRound(this.ps.getOnlinePlayers());
  }

  nextRound(scores){
    if(this.roundCount <= this.currentRound){
      this.emit("finishGame", this.currentRound, scores);
      this.ps.resetScores();
      return;
    }
    var task = this.gameTasks[this.currentRound];
    this.currentRound++;
    this.emit("updateIngame", this.currentRound, scores);

    setTimeout(() => {this.rm.newRound(this.ps.countOnlinePlayers(), task)}, 3000);
  }

  finishRound(scores){
    var updatedPlayers = this.ps.addScores(scores);
    this.nextRound(updatedPlayers);
  }

}
