import entityPrefab from './entityPrefab'

export default class Loot extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)

    // remove the nameholder for item
    // this.removeChildren(0, this.children.length)
    console.log('Our Loot', this)
  }
}
