const INITIALIZE = "INITIALIZE"
const UPDATE_PVP_BOARD = 'UPDATE PVP BOARD'
const UPDATE_KILL_BOARD = 'UPDATE KILL BOARD'
const UPDATE_LOOT_BOARD = 'UPDATE LOOT BOARD'

export const initialize = leaderBoard => (type: INITIALIZE, leaderBoard)
export const updatePVPBoard = player => ({type: UPDATE_PVP_BOARD, player})
export const updateKillBoard = player => ({type: UPDATE_KILL_BOARD, player})
export const updateLootBoard = player => ({type: UPDATE_LOOT_BOARD, player})


const initialState = {
  pvpBoard: [{name: 'test', pvpCount: 1}, {name: 'test', pvpCount: 1}, {name: 'test', pvpCount: 1}],
	killBoard: [{name: 'test', killCount: 1}, {name: 'test', killCount: 1}, {name: 'test', killCount: 1}],
  lootBoard: [{name: 'test', lootCount: 1}, {name: 'test', lootCount: 1}, {name: 'test', lootCount: 1}],
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {

  case INITIALIZE:
    return Object.assign({}, state, action.leaderBoard)

  case UPDATE_PVP_BOARD:
    
  	return Object.assign({}, state, {pvpBoard: gaugePosition(action.player, state.pvpBoard, pvpBoard)}) 

  case UPDATE_KILL_BOARD:
    
    return Object.assign({}, state, {killBoard: gaugePosition(action.player, state.killBoard, killBoard)}) 

  case UPDATE_LOOT_BOARD:
    
    return Object.assign({}, state, {lootBoard: gaugePosition(action.player, state.lootBoard, lootBoard)}) 

  }
  return state
}

// helper function
function gaugePosition(player, ranking, type) {
  let newBoard = ranking.slice()
  for (let i = 0; i < ranking.length; i++) {
    if (player.type > ranking[i]) {
      newBoard[i] = player
      break
    }
  }
  return newBoard
}

export default reducer









