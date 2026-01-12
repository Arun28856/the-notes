import 'dotenv/config';
import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import request from "./routes/restAPIs.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/ratelimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ['http://localhost:3003', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());
app.use(rateLimiter);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use("/api/notes", request);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
  }); 
});

const PORT1 = process.env.PORT || 3003;
app.listen(PORT1, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT1}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});