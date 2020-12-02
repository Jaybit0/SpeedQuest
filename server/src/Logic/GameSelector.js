
module.exports = class GameSelector{
  constructor(tasks){
    this.tasks = tasks;
  }

  generateTasks(roundCount){
    var tasksets = this.fillCardSet();
    this.genTasks = [];
    this.roundCount = roundCount;

    this.appendAvaibleTasks();
    return this.genTasks;
  }

  appendAvaibleTasks(){
    var tasksets = this.fillCardSet();
    this.repeatStage = 0;
    this.appendSet(tasksets);
  }

  fillCardSet(){
    var tasksets = JSON.parse(JSON.stringify(this.tasks));
    tasksets.forEach(task => task.setused = 0);
    return tasksets;
  }

  appendSet(tasksets){
    if(tasksets.length == 0)
      return this.appendAvaibleTasks();

    var task = this.selectRandomTask(tasksets);
    var taskset = this.selectRandomSet(tasksets, task)

    this.genTasks.push(new Object({name: task.name, rating: task.rating, parameters: taskset}));
    if(this.genTasks.length >= this.roundCount)
      return;

    if(tasksets[task.index].sets.length == 0)
      tasksets.splice(task.index, 1);

    this.appendSet(tasksets);
  }

  selectRandomTask(tasksets){
    var possibleTasks = [];
    do {
       possibleTasks = tasksets.filter((task, index) => {task.index = index; return task.setused == this.repeatStage});
       if(possibleTasks.length == 0)
        this.repeatStage++;
    } while (possibleTasks.length == 0);
    var task = possibleTasks[Math.floor(Math.random() * possibleTasks.length)];
    tasksets[task.index].setused++;
    return task;
  }

  selectRandomSet(tasksets, task){
    var setIndex = Math.floor(Math.random() * task.sets.length);
    var taskset = tasksets[task.index].sets.splice(setIndex, 1)[0];
    return taskset;
  }
}
