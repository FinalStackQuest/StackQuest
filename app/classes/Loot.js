import Game from './Game'

import EntityPrefab from './EntityPrefab'

/* global StackQuest */

export default class Loot extends EntityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)

    Game.items[name] = this

    Game.groups.items.add(this)
    this.type = spriteKey
  }
}
