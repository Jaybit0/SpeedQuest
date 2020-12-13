const GameSelector = require('./GameSelector.js');

module.exports = class ScriptedGameSelector extends GameSelector{
  constructor(tasks){
    super(tasks);
  }

  generateTasks(roundCount){
    this.genTasks = [];
    while(this.genTasks.length < roundCount){
      this.addTasks();
    }

    console.log(this.genTasks.slice(0, roundCount));

    return this.genTasks.slice(0, roundCount);
  }

  addTasks(){
    this.addTask("disarmbomb", 0);
    this.addTask("fasttyping", 1);
    this.addTask("question", 0);
    this.addTask("whacmole", 0);
    this.addTask("opensafe", 0);

  }

  addTask(taskname, setIndex){
    var task = this.tasks.find(task => task.name == taskname);
    if(task == null)
      return;

    var taskset = task.sets[setIndex];

    var taskset = this.makeAdditionalSettings(taskset, task);
    this.appendToTasks(task, taskset);

  }
}
