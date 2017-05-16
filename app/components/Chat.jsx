import React from 'react'
import { connect } from 'react-redux'
import { getMessages, addMessage, toggleChatBox } from 'APP/app/reducers/chat'
import { socket } from 'APP/app/sockets'

/* global $ */

socket.on('getMessages', messages => {
  getMessages
})

const Chat = ({ game, messages, message, showChat, messageChangeHandler, messageSubmitHandler, scrollDown }) => (
  <div className="chat-container">
    {game && showChat &&
      <div className="chat-display">
        <ul className="message-container">
          {messages.map((oldMessage, i) => (
              <li key={`message ${i + 1}`}>
                {oldMessage}
                {scrollDown()}
              </li>
            ))}
        </ul>
        <form className="new-message-form" onSubmit={messageSubmitHandler}>
          <input
            type="text"
            value={message}
            className="new-message-input"
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
    this.scrollDown = this.scrollDown.bind(this)
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
      const newMessage = `${this.props.user.userName} : ${this.state.message.slice(0, 255)}`
      socket.emit('addMessage', newMessage)
      this.props.addMessage(newMessage)
      this.setState({ message: '' })
    }
  }

  scrollDown() {
    $('.message-container').animate({scrollTop: 99999})
  }

  render() {
    return (
      <Chat
        game={this.props.game}
        messages={this.props.chat.messages}
        showChat={this.props.chat.showChat}
        message={this.state.message}
        messageChangeHandler={this.messageChangeHandler}
        messageSubmitHandler={this.messageSubmitHandler}
        scrollDown={this.scrollDown}
      />
    )
  }
}

const ChatContainer = connect(
  ({ auth, chat, game }) => ({ user: auth, chat, game }),
  { getMessages, addMessage, toggleChatBox }
  )(LocalContainer)

export default ChatContainer
