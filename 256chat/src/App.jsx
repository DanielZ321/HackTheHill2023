import React, { useState, useEffect } from 'react';
import {firebase} from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyBFaE2v0KsbQzkLdLvcJt5HGUkrsvD20lA",
  authDomain: "chatapp-80847.firebaseapp.com",
  projectId: "chatapp-80847",
  storageBucket: "chatapp-80847.appspot.com",
  messagingSenderId: "132817232542",
  appId: "1:132817232542:web:387ffb22e4c3dca2a6118f",
  measurementId: "G-Y31WESCL1C"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
  
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

      const messagesRef = firebase.database().ref('messages');
    messagesRef.on('child_added', (snapshot) => {
      const message = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const handleSignIn = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider);
  };

  const handleSignOut = () => {
       firebase.auth().signOut();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageObject = {
      text: newMessage,
      user: {
        uid: user.uid,
        displayName: user.displayName
      },
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };
        firebase.database().ref('messages').push(messageObject);
        setNewMessage('');
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="App">
      <header>
        <h1>Chat Room</h1>
        {user ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          <button onClick={handleSignIn}>Sign In with Google</button>
        )}
      </header>
      <div className="container">
        {user ? (
          <div>
            <form onSubmit={handleSubmit}>
              <input type="text" value={newMessage} onChange={handleInputChange} placeholder="Type a message..." />
              <button type="submit">Send</button>
            </form>
            <ul>
              {messages.map((message) => (
                <li key={message.createdAt}>
                  <strong>{message.user.displayName}</strong>: {message.text}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Please sign in to view and send messages.</p>
        )}
      </div>
    </div>
  );
}

export default App;
