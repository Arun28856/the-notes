import 'dotenv/config';
import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import request from "./routes/restAPIs.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/ratelimiter.js';
import * as Sentry from "@sentry/node";

const app = express();

Sentry.init({
  dsn: "https://9de7b5f6705c68a2d8f26769a5e21666@o4510764003033088.ingest.us.sentry.io/4510764095766528",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.expressIntegration({ app }),
  ],
});


const __dirname = path.resolve();

console.log(process.env.MONGODB_URI);

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

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})
}

// Sentry error handler must be registered after all controllers and before other error handlers
Sentry.setupExpressErrorHandler(app);

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