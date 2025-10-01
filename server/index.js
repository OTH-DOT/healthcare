import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import { initSockets } from "./sockets/socket.js";
import { startECGSimulation } from "./controllers/ecgController.js";
import ECG from "./models/ECG.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

connectDB();

// Initialize socket once
initSockets(server);

// Start ECG simulation
startECGSimulation();

// In your main server file
app.post("/api/ecg", async (req, res) => {
  try {
    console.log("📥 Received ECG save request:", req.body);
    
    const { signal, patientId } = req.body;

    if (!signal || !patientId) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing signal or patientId" 
      });
    }

    const newECG = new ECG({
      idECG: Date.now(),
      signal,
      patient: patientId
    });

    await newECG.save();
    console.log("✅ ECG saved successfully");
    res.status(201).json({ success: true, message: "ECG saved!" });
  } catch (err) {
    console.error("❌ Error saving ECG:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test route
app.get("/", (req, res) => res.json({ message: "Server running ✅" }));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
