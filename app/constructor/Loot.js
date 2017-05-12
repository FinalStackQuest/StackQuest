import entityPrefab from './entityPrefab'

const lootTypes = ['weapon, armor, loot']

export default class Loot extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    // set loot type to be random
    this.type = lootTypes[Math.floor(Math.random() * lootTypes.length)]
    super(game, name, position, spriteKey)

    // remove the nameholder for item
    // this.removeChildren(0, this.children.length)
  }
}
