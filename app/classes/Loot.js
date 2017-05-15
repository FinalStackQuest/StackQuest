import { GameGroups } from '../sockets'

import EntityPrefab from './EntityPrefab'

/* global StackQuest */

export default class Loot extends EntityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)

    GameGroups.items.add(this)
    this.type = spriteKey
  }
}
