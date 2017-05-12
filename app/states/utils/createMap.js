/* global StackQuest */

const createMap = {
  fantasy() {
    const map = StackQuest.game.add.tilemap('fantasyMap')

    map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')
    map.addTilesetImage('fishTilesheet@2', 'fishTileSheet2')
    map.addTilesetImage('RTS_medieval@2', 'rtsTileSheet2')
    map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
    map.addTilesetImage('sokoban_tilesheet@2', 'sokobanTileSheet2')

    const baseLayer = map.createLayer('base')
    const navigablesLayer = map.createLayer('navigables')
    const navigables2Layer = map.createLayer('navigables_2')
    const collisionsLayer = map.createLayer('collisions')
    const collisions2Layer = map.createLayer('collisions_2')

    baseLayer.resizeWorld()
    return map
  },

  space() {
    const map = StackQuest.game.add.tilemap('marsMap')

    map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
    map.addTilesetImage('scifi_tilesheet@2', 'scifiTileSheet')
    map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')

    const baseLayer = map.createLayer('base (red)')
    const navigablesLayer = map.createLayer('navigables')
    const navigables2Layer = map.createLayer('navigables_2')
    const collisionsLayer = map.createLayer('collisions')
    const collisions2Layer = map.createLayer('collisions_2')

    baseLayer.resizeWorld()
    return map
  }
}

export default createMap
