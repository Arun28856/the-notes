import express from "express";
import request from "./routes/restAPIs.js";

const app = express();

app.use("/api/notes", request);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});