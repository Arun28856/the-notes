import 'dotenv/config';
import express from "express";
import request from "./routes/restAPIs.js";
import { connectDB } from "./config/db.js";
import rateLimiter from './middleware/ratelimiter.js';

console.log(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(rateLimiter);
app.use("/api/notes", request);

app.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});