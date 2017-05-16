const makeDeathMap = map => {
  const deathArray = []
  for (let rowIdx = 0; rowIdx < map.height; rowIdx++) {
    const rowArray = []
    for (let colIdx = 0; colIdx < map.width; colIdx++) {
      let death = false
      for (const layer of map.layers) {
        if (layer.data[rowIdx][colIdx].collides) {
          death = true
          break
        }
      }
      rowArray.push(Number(death))
    }
    deathArray.push(rowArray)
  }
  return deathArray
}

export default makeDeathMap
