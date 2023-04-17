import { useState, useEffect } from 'react';
import './App.css';
import { AES, enc } from 'crypto-js';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from 'firebase/database';
import { GoogleAuthProvider } from 'firebase/auth';

import * as qrcode from 'qrcode';
import * as qrgenerator from 'qrcode-generator';

const firebaseConfig = {
  // Hey there
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

function App() {
  // Component state
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [secret, setSecret] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    // Firebase database listener
    const messagesRef = ref(database, 'messages');
    const unsubscribeMessages = onChildAdded(messagesRef, (snapshot) => {
      const message = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup
    return () => {
      unsubscribe();
      unsubscribeMessages();
    };
  }, [auth, database]);

  // Event handlers
  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.idToken;
      const qr = qrgenerator(4, 'M');
      qr.addData(idToken);
      qr.make();
      const qrCodeUrl = qr.createDataURL();
      setSecret(idToken);
      setQrCodeUrl(qrCodeUrl);
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageObject = {
      text: AES.encrypt(newMessage, 'testkey').toString(),
      user: {
        uid: user.uid,
        displayName: user.displayName
      },
      createdAt: serverTimestamp()
    };
    push(ref(database, 'messages'), messageObject);
    setNewMessage('');

    var objDiv = document.getElementById("textcontainer");
    objDiv.scrollTop = objDiv.scrollHeight;

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
      <div className="container" id="textcontainer">
        {user ? (
            <ul>
              {messages.map((message) => (
                <li key={message.createdAt}>
                  <strong>{message.user.displayName}</strong>: {AES.decrypt(message.text, 'testkey').toString(enc.Utf8)}
                </li>
              ))}
            </ul>

        ) : (
          <p>Please sign in to view and send messages.</p>
        )}
      </div>
      <div className="formcontainer">
        <form onSubmit={handleSubmit}>
          <input type="text" value={newMessage} onChange={handleInputChange} placeholder="Type a message..." />
          <button type="submit">Send</button>
        </form>
      </div>

    </div>
  );
}

export default App;