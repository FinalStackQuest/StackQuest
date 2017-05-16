/* CONSTANTS */
const SET_GAME_DISPLAY = 'SET_GAME_DISPLAY'

/* REDUCER */
const reducer = (state = false, action) => {
  switch (action.type) {
  case SET_GAME_DISPLAY:
    return action.bool
  }
  return state
}

/* ACTION CREATORS */
const setGameDisplay = bool => ({
  type: SET_GAME_DISPLAY,
  bool
})

/* DISPATCHERS */
export const showGameDisplay = bool =>
  dispatch =>
    dispatch(setGameDisplay(bool))

export default reducer
