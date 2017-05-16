import { combineReducers } from 'redux'
import auth from './auth'
import game from './game'
import chat from './chat'

const rootReducer = combineReducers({
  auth,
  game,
  chat
})

export default rootReducer
