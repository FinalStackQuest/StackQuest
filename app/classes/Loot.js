import {GameGroups}from '../sockets'

import entityPrefab from './entityPrefab'

/* global StackQuest */

export default class Loot extends entityPrefab {
  constructor(game, name, position, spriteKey) {
    super(game, name, position, spriteKey)

    GameGroups.items.add(this)
    this.type = spriteKey
  }
}
