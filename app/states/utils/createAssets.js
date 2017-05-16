/* global StackQuest */

let music

export const createFantasyAssets = () => {
  if (music) music.stop()
  music = StackQuest.game.add.audio('grasslands')
  music.play('', 0, 1, true)

  const map = StackQuest.game.add.tilemap('fantasyMap')

  map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')
  map.addTilesetImage('fishTilesheet@2', 'fishTileSheet2')
  map.addTilesetImage('RTS_medieval@2', 'rtsTileSheet2')
  map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
  map.addTilesetImage('sokoban_tilesheet@2', 'sokobanTileSheet2')

  setCollision(map)

  return map
}

export const createSpaceAssets = () => {
  if (music) music.stop()
  music = StackQuest.game.add.audio('mines')
  music.play('', 0, 1, true)

  const map = StackQuest.game.add.tilemap('marsMap')

  map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
  map.addTilesetImage('scifi_tilesheet@2', 'scifiTileSheet')
  map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')

  setCollision(map)

  return map
}

export const createPvpAssets = () => {
  if (music) music.stop()
  // music = StackQuest.game.add.audio('mines')
  // music.play('', 0, 1, true)

  const map = StackQuest.game.add.tilemap('PvpMap')

  map.addTilesetImage('tilesheet_complete_2X', 'completeTileSheet2')
  map.addTilesetImage('scifi_tilesheet@2', 'scifiTileSheet')
  map.addTilesetImage('mapPack_tilesheet_2X', 'mapPackTileSheet2')

  setCollision(map)

  return map
}

export const createCaveAssets = () => {
  if (music) music.stop()
  music = StackQuest.game.add.audio('day')
  music.play('', 0, 1, true)

  const map = StackQuest.game.add.tilemap('caveMap')

  map.addTilesetImage('tilesheet', 'browserQuestTileSheet')
  setCollision(map)
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

const setDeath = map => {
  StackQuest.game.layers = {}

  map.layers.forEach(layer => {
    StackQuest.game.layers[layer.name] = map.createLayer(layer.name)
    if (layer.properties.death) {
      const deathTiles = []
      layer.data.forEach(dataRow => {
        dataRow.forEach(tile => {
          if (tile.index > 0 && deathTiles.indexOf(tile.index) === -1) {
            deathTiles.push(tile.index)
          }
        })
      })
      map.setCollision(deathTiles, true, layer.name)
    }
  })

  StackQuest.game.layers[map.layer.name].resizeWorld()
}
