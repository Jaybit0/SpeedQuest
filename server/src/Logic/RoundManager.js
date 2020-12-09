const EventEmitter = require('events');

module.exports = class RoundManager extends EventEmitter{
  constructor(){
    super();
    this.playersScore = [];
    this.timer = null;
  }

  isFinished(){
    return this.timer == null;
  }

  newRound(expectPlayerCount, task, round){
    //Emit all task
    this.emit("newTask", task, round);
    this.expectPlayerCount = expectPlayerCount;
    this.playersScore = [];
    this.task = task;

    console.log(task);
    this.timer = setTimeout(() => {this.finish()}, task.maxtime * 1000);
  }

  finish(){
    if(this.timer != null)
      clearTimeout(this.timer);
    this.timer = null;
    this.buildScore();
    this.emit("finishTask", this.playersScore);
  }

  buildScore(){
    if(this.task.rating == "step"){
      this.playersScore.forEach((item, index) => {
        var percent = 100 - (index * 20);
        if(percent > 0)
          item.score = item.score * percent;
        else
          item.score = 0;
      });
    }else if(this.task.rating == "first"){
      this.playersScore.forEach((item, index) => {
        if(index > 0)
          item.score = 0;
      });
    }
  }

  playerFinish(player, score){
    if(this.timer == null)
      return;
    if(this.playersScore.findIndex(item => item.player.name == player.name) != -1)
      return;
    this.playersScore.push(new Object({player: player, score: score}));
    if(this.expectPlayerCount <= this.playersScore.length)
      this.finish();
  }
}
