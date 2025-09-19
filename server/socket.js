// socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // simulate ECG signal every 1 second
    const interval = setInterval(() => {
      const fakeECG = Math.floor(Math.random() * 100); // random heart rate value
      socket.emit("ecg-data", { value: fakeECG, time: Date.now() });
    }, 1000);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
      clearInterval(interval);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
