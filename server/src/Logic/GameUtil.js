const fs = require('fs');

module.exports = class GameUtil{
    static readGames(){
        let rawdata = fs.readFileSync('./config/games.json');
        let tasks = JSON.parse(rawdata).tasks;
        return tasks;
    }
}
