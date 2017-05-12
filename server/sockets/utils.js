const findClosestPlayer = (currentPlayers, enemy) => {
  const playerIds = Object.keys(currentPlayers)
  let maxDist = Infinity
  let closestPlayer
  for (const playerId of playerIds) {
    const player = currentPlayers[playerId]
    const dist = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2))
    if (dist < maxDist) {
      closestPlayer = player
      maxDist = dist
    }
  }
  return closestPlayer
}

module.exports = {
  findClosestPlayer
}
