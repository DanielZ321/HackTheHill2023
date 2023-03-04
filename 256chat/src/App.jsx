import { useState } from 'react'
import './App.css'

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const chats = [
    { 
      id: 1, 
      name: 'John', 
      messages: [
        { id: 1, text: 'Hey, what\'s up?' },
        { id: 2, text: 'Not much, how about you?' },
        // Add more messages as needed
      ]
    },
    { 
      id: 2, 
      name: 'Jane', 
      messages: [
        { id: 1, text: 'Can\'t wait to see you!' },
        { id: 2, text: 'Me too! When are you free?' },
        // Add more messages as needed
      ]
    },
    { 
      id: 3, 
      name: 'Bob', 
      messages: [
        { id: 1, text: 'Let\'s grab lunch tomorrow.' },
        { id: 2, text: 'Sure, where do you want to go?' },
        // Add more messages as needed
      ]
    },
    // Add more chat objects as needed
  ];

  function handleChatClick(chatId) {
    setSelectedChat(chatId);
  }

  function handleSendMessage(message) {
    setMessages([...messages, message]);
  }

  return (
    <div className="App">
      <div className="chats">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className={`chat ${chat.id === selectedChat ? 'active' : ''}`} 
            onClick={() => handleChatClick(chat.id)}
          >
            <div className="name">{chat.name}</div>
            <div className="last-message">{chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : ''}</div>
          </div>
        ))}
      </div>
      <div className="conversation">
        {selectedChat ? (
          <>
            <div className="messages">
              {chats.find(chat => chat.id === selectedChat).messages.map((message, index) => (
                <div key={message.id} className="message">
                  {message.text}
                </div>
              ))}
            </div>
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="select-chat">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  function handleInputChange(event) {
    setMessage(event.target.value);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (message) {
      onSendMessage({ id: Date.now(), text: message });
      setMessage('');
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="message-input">
      <input type="text" value={message} onChange={handleInputChange} placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  );
}

export default App;
