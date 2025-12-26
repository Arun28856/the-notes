import express from 'express';

const request = express.Router();

export default request;

request.get("/", (req, res) => {
  res.send("Hello from Notes API");
});


request.post("/", (req, res) => {
  res.json({message: "post created succuessfully"});
});

request.put("/:id", (req, res) => {
    res.json({message: "Post updated successfully"});
});

request.delete("/:id", (req, res) => {
    res.json({message: "Post deleted successfully"});
});

