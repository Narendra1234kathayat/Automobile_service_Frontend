// src/socket.js
import { io } from 'socket.io-client';

// Replace with your backend URL and port
const SOCKET_URL = "https://sparelink-backend-al5v.onrender.com"; // or your deployed URL

const SocketUser = io(SOCKET_URL, {
  transports: ['websocket'],
});

export default SocketUser;
