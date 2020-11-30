const EventEmitter = require('events');

const PlayerService = require('./PlayerService.js');
const PlayerAdapter = require('./Connector/PlayerAdapter.js');
const InitialDataAdapter = require('./Connector/InitialDataAdapter.js');
const GameAdapter = require('./Connector/GameAdapter.js');
const GameLogic = require('./GameLogic.js');
const GameSocket = require('./Connector/GameSocket.js');

module.exports = class Game extends EventEmitter{
  constructor(key){
    super();
    this.gs = new GameSocket();

    //Services
    this.ps = new PlayerService();

    this.gl = new GameLogic(this.ps);


    //Connectors
    const id = new InitialDataAdapter(this.gs, this.ps, this.gl, key);
    const po = new PlayerAdapter(this.gs, this.ps);
    const go = new GameAdapter(this.gs, this.gl, this.ps);

    this.ps.on("resetGame", this.resetGame.bind(this));
  }
 
  newPlayer(name){
    return this.ps.loadPlayer(name);
  }

  playerConnect(ws, name){
    this.gs.connect(ws, name);
  }

  resetGame(){
    this.emit("resetGame");
  }
};
