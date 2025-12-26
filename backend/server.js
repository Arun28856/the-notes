import express from "express";
import request from "./restAPIs.js";

const app = express();

app.get("/api/notes", (req, res) => {
  res.send("Hello from Notes API");
});

app.use("/api/notes", request);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});