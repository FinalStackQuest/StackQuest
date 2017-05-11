module.exports = {
  findClosestPlayer: (currentMap, enemy) => findClosestPlayer(currentMap, enemy),
}

function findClosestPlayer(currentMap, enemy) {
  const playerIds = Object.keys(currentMap)
  let maxDist = Infinity
  let closestPlayer
  for (const playerId of playerIds) {
    const player = currentMap[playerId]
    const dist = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2))
    if (dist < maxDist) {
      closestPlayer = player
      maxDist = dist
    }
  }
  return closestPlayer
}
