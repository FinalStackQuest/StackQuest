import React from 'react'
import { connect } from 'react-redux'
import { getMessages, addMessage } from 'APP/app/reducers/chat'
import { socket } from 'APP/app/sockets'

socket.on('getMessages', messages => {
  getMessages
})

const Chat = ({ messages, message }) => (
  <div className="chat-container">
    Hi
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
      />
    )
  }
}

const ChatContainer = connect(
  ({ chat }) => { chat },
  { getMessages, addMessage }
  )(Chat)

export default ChatContainer
