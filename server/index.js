import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';
import { initSocket } from './socket.js';
import { initSockets } from './sockets/socket.js';
import { startECGSimulation } from './controllers/ecgController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// create ONE http server
const server = http.createServer(app);

// middleware
app.use(cookieParser());
app.use(cors({
  origin:[process.env.ORIGIN],
  methods:["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}));
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);

// connect DB
connectDB();

// initialize socket.io
initSocket(server);
initSockets(server);

// Start ECG simulation
startECGSimulation();

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Server running ✅' });
});

// start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
