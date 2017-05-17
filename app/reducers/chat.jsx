/* CONSTANTS */
export const TOGGLE_CHAT = 'TOGGLE_CHAT'
export const READ_MESSAGES = 'READ_MESSAGES'
export const CREATE_MESSAGE = 'CREATE_MESSAGE'

/* REDUCER */
const initialState = {
  showChat: true,
  messages: []
}

const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state)

  switch (action.type) {
  case TOGGLE_CHAT:
    newState.showChat = !newState.showChat
    break

  case READ_MESSAGES:
    newState.messages = action.messages
    break

  case CREATE_MESSAGE:
    if (newState.messages.length >= 100) newState.messages.shift()
    newState.messages.push(action.message)
    break

  default:
    return state
  }
  return newState
}

/* ACTION CREATORS */
const toggleChat = () => ({
  type: TOGGLE_CHAT
})

const readMessages = messages => ({
  type: READ_MESSAGES,
  messages
})

const createMessage = message => ({
  type: CREATE_MESSAGE,
  message
})

/* DISPATCHERS */
export const toggleChatBox = () =>
  dispatch => dispatch(toggleChat())

export const getMessages = messages =>
  dispatch => dispatch(readMessages(messages))

export const addMessage = message =>
  dispatch => dispatch(createMessage(message))

export default reducer
