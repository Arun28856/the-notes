import 'dotenv/config';
import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import request from "./routes/restAPIs.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/ratelimiter.js';

const __dirname = path.resolve();

console.log(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 8080;

if(process.env.NODE_ENV !== "production") {
  // CORS configuration - allow Railway production URLs and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  process.env.FRONTEND_URL,
  process.env.AUTH_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", request);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})
};

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  }); 
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});