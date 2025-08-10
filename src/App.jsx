import './App.css';
import './index.css';
import Navbar from './components/navbar/Navbar';
import Login from './components/auth/Login';

import React, { useEffect, useState } from "react";
//import socket from "../src/socket/SocketUser.js"; // adjust path if different
function App() {
  useEffect(() => {
    // Listening to a message from backend
    socket.on("message", (data) => {
      console.log("Received from server:", data);
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);
  
  
  // To test sending data
  // const sendTestMessage = () => {
  //   socket.emit("message", { user: "Frontend", text: "Hello from frontend!" });
  // };
  // const [messages, setMessages] = useState([]);

  return (
    <>
      <div className=' position-relative mainbox w-100 mt-5'>
        {/* <Navbar/>
        <Login/> */}
        <button onClick={sendTestMessage} className="btn btn-primary m-3">Send Test Message</button>
        <div className="messages">  
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}

        </div>
        
      
      </div>
    </>
  )
}

export default App
