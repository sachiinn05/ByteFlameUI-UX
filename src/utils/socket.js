import io from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL || "https://byteflame-backend.onrender.com", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const createSocketConnection = () => getSocket();
