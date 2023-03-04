import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  function handleSendMessage(message) {
    setMessages([...messages, message]);
  }

  return (
    <div className="App">
      <div className="conversation">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <div className="username">{message.username}</div>
              <div className="text">{message.text}</div>
            </div>
          ))}
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  function handleInputChange(event) {
    setMessage(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (message) {
      onSendMessage({ id: Date.now(), username: username, text: message });
      setMessage('');
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="message-input">
      <input type="text" value={username} onChange={handleUsernameChange} placeholder="Your username" />
      <input type="text" value={message} onChange={handleInputChange} placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  );
}

export default App;
