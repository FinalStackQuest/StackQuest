/* global StackQuest */

const createMap = {
  fantasy() {
    const map = StackQuest.game.add.tilemap('fantasyMap')

    map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')
    map.addTilesetImage('fishTilesheet@2', 'fishTileSheet2')
    map.addTilesetImage('RTS_medieval@2', 'rtsTileSheet2')
    map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
    map.addTilesetImage('sokoban_tilesheet@2', 'sokobanTileSheet2')

    setCollision(map)

    return map
  },

  space() {
    const map = StackQuest.game.add.tilemap('marsMap')

    map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
    map.addTilesetImage('scifi_tilesheet@2', 'scifiTileSheet')
    map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')

    setCollision(map)

    return map
  }
}

const setCollision = map => {
  StackQuest.game.layers = {}

  map.layers.forEach(layer => {
    StackQuest.game.layers[layer.name] = map.createLayer(layer.name)
    if (layer.properties.collision) {
      const collisionTiles = []
      layer.data.forEach(dataRow => {
        dataRow.forEach(tile => {
          if (tile.index > 0 && collisionTiles.indexOf(tile.index) === -1) {
            collisionTiles.push(tile.index)
          }
        })
      })
      map.setCollision(collisionTiles, true, layer.name)
    }
  })

  StackQuest.game.layers[map.layer.name].resizeWorld()
}

export default createMap
