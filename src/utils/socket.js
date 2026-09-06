import io from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket =
      location.hostname === "localhost"
        ? io(BASE_URL, { withCredentials: true })
        : io("/", { path: "/api/socket.io", withCredentials: true });
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
