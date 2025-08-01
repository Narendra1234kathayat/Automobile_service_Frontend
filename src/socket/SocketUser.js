// src/socket.js
import { io } from 'socket.io-client';

// Replace with your backend URL and port
const SOCKET_URL = "http://localhost:5000"; // or your deployed URL

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

export default socket;
