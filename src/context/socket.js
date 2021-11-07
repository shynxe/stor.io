import {io} from "socket.io-client";
import React from "react";

const SOCKET_URL = "http://192.168.100.8:3001/";

export const socket = io.connect(SOCKET_URL);
export const SocketContext = React.createContext();