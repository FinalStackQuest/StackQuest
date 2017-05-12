/* global StackQuest, Phaser */

const loadMaps = {
  fantasy() {
    StackQuest.game.load.tilemap('fantasyMap', 'assets/maps/fantasyMap.json', null, Phaser.Tilemap.TILED_JSON)
    StackQuest.game.load.image('mapPackTileSheet2', 'assets/tilesets/Map_Pack/Tilesheet/mapPack_tilesheet_2X.png')
    StackQuest.game.load.image('fishTileSheet2', 'assets/tilesets/Fish_Pack/Tilesheet/fishTilesheet@2.png')
    StackQuest.game.load.image('rtsTileSheet2', 'assets/tilesets/RTS_Medieval/Tilesheet/RTS_medieval@2.png')
    StackQuest.game.load.image('completeTileSheet2', 'assets/tilesets/Topdown_Shooter/Tilesheet/tilesheet_complete_2X.png')
    StackQuest.game.load.image('sokobanTileSheet2', 'assets/tilesets/Sokoban_Pack/Tilesheet/sokoban_tilesheet@2.png')

    StackQuest.game.load.image('bullet', 'assets/sprites/tank_bulletFly4.png')
    StackQuest.game.load.spritesheet('soldier', 'assets/tilesets/LPC Base Assets/sprites/people/soldier.png', 64, 64)
    StackQuest.game.load.spritesheet('soldieralt', 'assets/tilesets/LPC Base Assets/sprites/people/soldier_altcolor.png', 64, 64)
    StackQuest.game.load.spritesheet('item', 'assets/tilesets/LPC Base Assets/sprites/monsters/eyeball.png', 32, 32)
  },

  space() {
    StackQuest.game.load.tilemap('marsMap', 'assets/maps/marsMap.json', null, Phaser.Tilemap.TILED_JSON)
    StackQuest.game.load.image('completeTileSheet2', 'assets/tilesets/Topdown_Shooter/Tilesheet/tilesheet_complete_2X.png')
    StackQuest.game.load.image('scifiTileSheet', 'assets/tilesets/RTS_Sci-fi/Tilesheet/scifi_tilesheet@2.png')
    StackQuest.game.load.image('mapPackTileSheet2', 'assets/tilesets/Map_Pack/Tilesheet/mapPack_tilesheet_2X.png')

    StackQuest.game.load.image('bullet', 'assets/sprites/tank_bulletFly4.png')
    StackQuest.game.load.spritesheet('soldier', 'assets/tilesets/LPC Base Assets/sprites/people/soldier.png', 64, 64)
    StackQuest.game.load.spritesheet('soldieralt', 'assets/tilesets/LPC Base Assets/sprites/people/soldier_altcolor.png', 64, 64)
  }
}

export default loadMaps
