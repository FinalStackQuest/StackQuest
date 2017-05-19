import Game from './Game'

import EntityPrefab from './EntityPrefab'

/* global StackQuest */

export default class Loot extends EntityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)

    Game.GameItems[name] = this

    Game.GameGroups.items.add(this)
    this.type = spriteKey
  }
}
