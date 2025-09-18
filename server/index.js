import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
// import authRoutes from './routes/AuthRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(cors({
  origin:[process.env.ORIGIN],
  methods:["GET","POST","PUT","PATCH","DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:true
}))

app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/contact', contactRoutes);


connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
