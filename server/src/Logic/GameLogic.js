
const EventEmitter = require('events');
const GameUtil = require('./GameUtil.js');

module.exports = class GameLogic extends EventEmitter{
  constructor(ps){
    super();
    this.ps = ps;
    
  }
}
