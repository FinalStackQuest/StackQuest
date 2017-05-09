const PF = require('pathfinding')

const testGrid = [[0, 0, 0], [0, 1, 1], [0, 0, 0]]

const PFgrid = new PF.Grid(testGrid)
const pathfinder = new PF.AStarFinder()

const path = pathfinder.findPath(0, 0, 2, 2, PFgrid)
console.log('path', path)
