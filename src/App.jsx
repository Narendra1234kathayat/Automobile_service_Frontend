import './App.css';
import './index.css';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from './components/navbar/Navbar';
import Login from './components/auth/Login';
import AOS from "aos";
import "aos/dist/aos.css"; 

import React, { useEffect, useState } from "react";
//import socket from "../src/socket/SocketUser.js"; // adjust path if different
function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: false,     // Whether animation should happen only once
    });
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
         {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        zindex={99999999}
        theme="dark"
      />
        {/* <button onClick={sendTestMessage} className="btn btn-primary m-3">Send Test Message</button>
        <div className="messages">  
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}

        </div> */}
        
      
      </div>
    </>
  )
}

export default App
