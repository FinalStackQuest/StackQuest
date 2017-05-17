/* global $ */

/* CONSTANTS */
export const TOGGLE_CHAT = 'TOGGLE_CHAT'
export const READ_MESSAGES = 'READ_MESSAGES'
export const CREATE_MESSAGE = 'CREATE_MESSAGE'

/* REDUCER */
const initialState = {
  showChat: false,
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
  dispatch => {
    setTimeout(() => $('.message-container').animate({scrollTop: 99999}), 100)
    setTimeout(() => dispatch(addMessage('Welcome to StackQuest'), 100))
    setTimeout(() => dispatch(addMessage('Press Tab to toggle the chat'), 100))
    return dispatch(readMessages(messages))
  }

export const addMessage = message =>
  dispatch => {
    setTimeout(() => $('.message-container').animate({scrollTop: 99999}), 100)
    return dispatch(createMessage(message))
  }

export default reducer
