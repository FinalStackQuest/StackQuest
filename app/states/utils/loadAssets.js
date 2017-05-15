/* global StackQuest, Phaser */
128, 72
const loadAssets = () => {
  // common assets
  StackQuest.game.load.image('bullet', 'assets/sprites/tank_bulletFly4.png')
  StackQuest.game.load.image('missile', 'assets/sprites/tank_bulletFly4.png')
  StackQuest.game.load.spritesheet('fireball', 'assets/sprites/fireball.png', 31, 27)
  StackQuest.game.load.spritesheet('wizardSpecial', 'assets/sprites/lightning.png', 128, 72)
  StackQuest.game.load.spritesheet('soldier', 'assets/tilesets/LPC Base Assets/sprites/people/soldier.png', 64, 64)
  StackQuest.game.load.spritesheet('soldieralt', 'assets/tilesets/LPC Base Assets/sprites/people/soldier_altcolor.png', 64, 64)
  StackQuest.game.load.spritesheet('bat', 'assets/tilesets/LPC Base Assets/sprites/monsters/bat.png', 32, 32)
  StackQuest.game.load.spritesheet('wizard', 'assets/sprites/wizard2.png', 64, 64)
  StackQuest.game.load.spritesheet('cyborg', 'assets/sprites/cyborg.png', 64, 64)
  StackQuest.game.load.spritesheet('loot', 'assets/tilesets/LPC Base Assets/sprites/monsters/eyeball.png', 32, 32)
  StackQuest.game.load.spritesheet('weapon', 'assets/sprites/sword.png', 25, 64)
  StackQuest.game.load.spritesheet('armor', 'assets/sprites/shield.png', 64, 64)

  // fantasy state assets
  StackQuest.game.load.tilemap('fantasyMap', 'assets/maps/fantasyMap.json', null, Phaser.Tilemap.TILED_JSON)
  StackQuest.game.load.image('mapPackTileSheet2', 'assets/tilesets/Map_Pack/Tilesheet/mapPack_tilesheet_2X.png')
  StackQuest.game.load.image('fishTileSheet2', 'assets/tilesets/Fish_Pack/Tilesheet/fishTilesheet@2.png')
  StackQuest.game.load.image('rtsTileSheet2', 'assets/tilesets/RTS_Medieval/Tilesheet/RTS_medieval@2.png')
  StackQuest.game.load.image('completeTileSheet2', 'assets/tilesets/Topdown_Shooter/Tilesheet/tilesheet_complete_2X.png')
  StackQuest.game.load.image('sokobanTileSheet2', 'assets/tilesets/Sokoban_Pack/Tilesheet/sokoban_tilesheet@2.png')
  StackQuest.game.load.audio('grasslands', ['assets/audio/Exploration1_Grasslands.mp3', 'assets/audio/Exploration1_Grasslands.ogg'])

  // space state assets
  StackQuest.game.load.tilemap('marsMap', 'assets/maps/marsMap.json', null, Phaser.Tilemap.TILED_JSON)
  StackQuest.game.load.image('completeTileSheet2', 'assets/tilesets/Topdown_Shooter/Tilesheet/tilesheet_complete_2X.png')
  StackQuest.game.load.image('scifiTileSheet', 'assets/tilesets/RTS_Sci-fi/Tilesheet/scifi_tilesheet@2.png')
  StackQuest.game.load.image('mapPackTileSheet2', 'assets/tilesets/Map_Pack/Tilesheet/mapPack_tilesheet_2X.png')
  StackQuest.game.load.audio('mines', ['assets/audio/Exploration3_Tha_el_Mines.mp3', 'assets/audio/Exploration3_Tha_el_Mines.ogg'])
}

export default loadAssets
