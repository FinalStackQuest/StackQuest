import entityPrefab from './entityPrefab'

/* global StackQuest */

export default class Loot extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)
    this.type = spriteKey
    this.pickUp = this.pickUp.bind(this)
  }

  pickUp() {
    let displayText
    switch (this.type) {
    case ('loot'):
      displayText = 'Loot acquired'
      break
    case ('weapon'):
      displayText = 'Weapon acquired, Attack +1'
      break
    case ('armor'):
      displayText = 'Armor acquired, Defense +1'
      break
    }
    const notice = StackQuest.game.add.text(this.x, this.y + 20, displayText, { font: '22px Times New Roman', fill: '#ffffff' })
    setTimeout(() => notice.destroy(), 3000)
  }
}
