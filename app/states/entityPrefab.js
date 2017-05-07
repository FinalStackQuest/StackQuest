/*
- all characters should extend from entityPrefab constructor
*/

export default class entityPrefab extends Phaser.Sprite {
  constructor(game, name, position, properties) {
    super(game, position.x, position.y, properties.sprite, properties.initialFrame)

    this.gameState = game
    this.name = name
    this.initialFrame = properties.initalFrame

    if (properties.group) {
      this.gameState.groups[properties.group].children.push(this)
      // gameState has groups object that stores all group types
    }

    this.gameState.add(this)
    // adds current prefab to the gameState

    this.physics.p2.enable(this)

    this.gameState.prefabs[name] = this
    // gameState has prefabs object that allows access to current prefab
  }
}
