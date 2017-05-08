import entityPrefab from './Prefab'


//  TO DO:
//  1. Make sure the 'Game' global is passed in
//  2. Make sure global Game has the props defined here

export default class NPC extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)
    this.rate = 2 // animation rate
    this.absorbProperties(Game.npcInfo[spriteKey])

    //  custom anchor is most likely unnecessary
    if (this.customAnchor) {
      this.anchor.set(this.customAnchor.x, this.customAnchor.y)
    } else {
      this.anchor.set(0, 0.25)
    }
    this.addChild(game.add.sprite(0, 4, 'atlas1','shadow'))
    var tile = Game.computeTileCoords(this.x, this.y)

    //  this adds that NPC to the collisions array of objects
    Game.collisionArray[tile.y][tile.x] = 1

    //  this isn't necessarily a click, should be whatever we have
    // chosen as the key that handles when the user wants
    // to interact with an NPC
    this.events.onInputUp.add(Game.handleCharClick, this)
  }
}
