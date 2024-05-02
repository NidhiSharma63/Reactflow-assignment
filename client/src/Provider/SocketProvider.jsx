// src/socketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { SOCKET_URL } from "../utils/constant";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish connection once at the provider level
    const socketIo = io(SOCKET_URL, { transports: ["websocket"] }); // Ensuring WebSocket transport

    socketIo.on("connect", () => {
      console.log("Connected to server via WebSocket");
    });

    socketIo.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(socketIo);

    return () => {
      console.log("Disconnecting WebSocket");
      socketIo.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
