import React from 'react'
import { connect } from 'react-redux'
import { getMessages, addMessage } from 'APP/app/reducers/chat'
import { socket } from 'APP/app/sockets'

socket.on('getMessages', messages => {
  getMessages
})

const Chat = ({ gameExist, messages, message }) => (
  <div className="chat-container">
    Hi
    {gameExist &&
      <div>
        GAME EXISTS
      </div>
    }
  </div>
)

class LocalContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      message: ''
    }
  }

  componentDidMount() {
    socket.on('getMessages', messages => {
      this.props.getMessages(messages)
    })

    socket.on('addMessage', message => {
      this.props.addMessage(message)
    })

    socket.emit('getMessages')
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps)
  }

  render() {
    return (
      <Chat
        {...this.state}
        gameExist={this.props.game}
      />
    )
  }
}

const ChatContainer = connect(
  ({ chat, game }) => ({ chat, game }),
  { getMessages, addMessage }
  )(LocalContainer)

export default ChatContainer
