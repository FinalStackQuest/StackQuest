const buildMap = {
  fantasy() {
    const map = StackQuest.game.add.tilemap('stackQuestFantasyMap')
    map.addTilesetImage('pirate_sheet', 'pirateSheet')
    map.addTilesetImage('pirate_sheet2', 'pirateSheet2')
    map.addTilesetImage('rts_medieval_sheet2', 'rtsSheet2')

    const grassLayer = map.createLayer('grass_layer')
    const waterLayer = map.createLayer('water_layer')
    const stuffLayer = map.createLayer('stuff_layer')

    grassLayer.resizeWorld()
  },

  space() {
    const map = StackQuest.game.add.tilemap('stackQuestSpaceMap')

    map.addTilesetImage('tilesheet_complete', 'topDownShooterSheet')
    map.addTilesetImage('scifi_tilesheet', 'scifiSheet')
    map.addTilesetImage('mapPack_tilesheet', 'mapPackSheet')

    const groundLayer = map.createLayer('ground_layer')
    const buildingLayer = map.createLayer('building_layer')
    const treeLayer = map.createLayer('tree_layer')

    groundLayer.resizeWorld()
  }
}

export default buildMap
