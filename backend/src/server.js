import 'dotenv/config';
import express from "express";
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';

import request from "./routes/restAPIs.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/ratelimiter.js';
import { validateEmailDomain } from "./Controllers/validateEmailController.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const __dirname = path.resolve();

const PORT = process.env.PORT || 8080;

if(process.env.NODE_ENV !== "production") {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
  ].filter(Boolean);

  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", request);
app.post("/api/validate-email", validateEmailDomain);
app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../frontend/dist");
  console.log(`✓ Serving static files from: ${staticPath}`);

  app.use(express.static(staticPath));

  app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
  })
}

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Working directory: ${__dirname}`);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection?.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
