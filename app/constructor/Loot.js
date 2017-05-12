import entityPrefab from './entityPrefab'

const lootTypes = ['weapon', 'armor', 'loot']

export default class Loot extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)
    this.type = lootTypes[Math.floor(Math.random() * lootTypes.length)]
    // remove the nameholder for item
    // this.removeChildren(0, this.children.length)
    console.log('Our Loot', this)
  }
}
