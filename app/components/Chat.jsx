import React from 'react'
import { connect } from 'react-redux'
import { getMessages, addMessage } from 'APP/app/reducers/chat'
import { socket } from 'APP/app/sockets'

socket.on('getMessages', messages => {
  getMessages
})

const Chat = ({ game, messages, message, messageChangeHandler, messageSubmitHandler }) => (
  <div className="chat-container">
    {game &&
      <div>
        <ul>
          {messages.map((oldMessage, i) => (
              <li key={`message ${i + 1}`}>
                {oldMessage}
              </li>
            ))}
        </ul>
        <form onSubmit={messageSubmitHandler}>
          <input
            type="text"
            value={message}
            onChange={messageChangeHandler}
          />
        </form>
      </div>
    }
  </div>
)

class LocalContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      message: ''
    }

    this.messageChangeHandler = this.messageChangeHandler.bind(this)
    this.messageSubmitHandler = this.messageSubmitHandler.bind(this)
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

  messageChangeHandler(event) {
    this.setState({ message: event.target.value })
  }

  messageSubmitHandler(event) {
    event.preventDefault()
    // do not allow empty string
    if (this.state.message !== '') {
      const newMessage = `${this.props.user.userName} : ${this.state.message}`
      socket.emit('addMessage', newMessage)
      this.props.addMessage(newMessage)
      this.setState({ message: '' })
    }
  }

  render() {
    return (
      <Chat
        game={this.props.game}
        messages={this.props.chat.messages}
        message={this.state.message}
        messageChangeHandler={this.messageChangeHandler}
        messageSubmitHandler={this.messageSubmitHandler}
      />
    )
  }
}

const ChatContainer = connect(
  ({ auth, chat, game }) => ({ user: auth, chat, game }),
  { getMessages, addMessage }
  )(LocalContainer)

export default ChatContainer
