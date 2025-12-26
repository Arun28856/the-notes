import express from 'express';

const router = express.Router();

export default router;

router.post("/", (req, res) => {
  res.json({message: "post created succuessfully"});
});

router.put("/:id", (req, res) => {
    res.json({message: "Post updated successfully"});
});

router.delete("/:id", (req, res) => {
    res.json({message: "Post deleted successfully"});
});

