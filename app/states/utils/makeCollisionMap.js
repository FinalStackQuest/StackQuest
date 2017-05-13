import { socket } from 'APP/app/sockets'

const makeCollisionMap = map => {
  const collisionArray = []
  for (let rowIdx = 0; rowIdx < map.height; rowIdx++) {
    const rowArray = []
    for (let colIdx = 0; colIdx < map.width; colIdx++) {
      let collision = false
      for (const layer of map.layers) {
        if (layer.data[rowIdx][colIdx].collides) {
          collision = true
          break
        }
      }
      rowArray.push(Number(collision))
    }
    collisionArray.push(rowArray)
  }
  return collisionArray
}

export default makeCollisionMap
