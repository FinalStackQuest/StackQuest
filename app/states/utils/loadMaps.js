const loadMaps = {
  fantasy() {
    StackQuest.game.load.tilemap('stackQuestFantasyMap', 'assets/maps/StackQuestFantasyTilemap.json', null, Phaser.Tilemap.TILED_JSON)
    StackQuest.game.load.image('pirateSheet', 'assets/tilesets/Pirate_Pack/Tilesheet/tiles_sheet.png')
    StackQuest.game.load.image('pirateSheet2', 'assets/tilesets/Pirate_Pack/Tilesheet/tiles_sheet@2.png')
    StackQuest.game.load.image('rtsSheet2', 'assets/tilesets/RTS_Medieval/Tilesheet/RTS_medieval@2.png')
  },

  space() {
    StackQuest.game.load.tilemap('stackQuestSpaceMap', 'assets/maps/StackQuestSpaceTilemap.json', null, Phaser.Tilemap.TILED_JSON)
    StackQuest.game.load.image('topDownShooterSheet', 'assets/tilesets/Topdown_Shooter/Tilesheet/tilesheet_complete.png')
    StackQuest.game.load.image('scifiSheet', 'assets/tilesets/RTS_Sci-fi/Tilesheet/scifi_tilesheet.png')
    StackQuest.game.load.image('mapPackSheet', 'assets/tilesets/Map_Pack/Tilesheet/mapPack_tilesheet.png')
  }
}

export default loadMaps
