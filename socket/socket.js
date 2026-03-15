const { Server } = require("socket.io");
const allowedOrigins = require("../config/allowedOrigins");
const registerMessageHandlers = require("./message.socket");
const { userConnect } = require("../services/presence.service");

let ioInstance;

const initSocket = (server) => {
  if (ioInstance) {
    console.log("Socket Io already initialized. Return existing one");
    return ioInstance;
  }
  console.log("connect socket io...");

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    socket.userId = socket.handshake.auth.userId;
    socket.deviceId = socket.handshake.auth.deviceId;
    next();
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.userId);
    socket.join(socket.userId);

    const oldSocketId = userConnect(socket.userId, socket.id, socket.deviceId);

    if (oldSocketId && oldSocketId !== socket.id) {
      // kick the old device off
      const oldSocket = io.sockets.sockets.get(oldSocketId);
      if (oldSocket) {
        oldSocket.emit("force:disconnect", {
          reason: "Logged in on another device",
        });
        oldSocket.disconnect(true);
      }
    }

    registerMessageHandlers(io, socket, onlineUsers);

    socket.on("disconnect", () => {
      delete onlineUsers[socket.userId];
      console.log("user disconnected");
    });
  });

  ioInstance = io;
  return io;
};

module.exports = {
  initSocket,
  getIo: () => {
    if (!ioInstance) {
      throw new Error("Socket.IO not initialized! Call initSocket first.");
    }
    return ioInstance;
  },
};
