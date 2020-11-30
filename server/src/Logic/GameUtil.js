
module.exports = class GameUtil{
  static isDouble(dice){
    return (dice.first === dice.second);
  }

  static getNewPos(dice, player){
    return (player.position + dice.first + dice.second) % 40;
  }
}
