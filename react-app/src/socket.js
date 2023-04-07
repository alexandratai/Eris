import { io } from "socket.io-client";
import React from 'react';

export const socket = io('/', { pingInterval: 30000, pingTimeout: 10000 });

export const SocketContext = React.createContext();