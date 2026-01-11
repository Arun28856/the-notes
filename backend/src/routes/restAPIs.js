import express from 'express';
import { getNotes, createNotes, updateNotes, deleteNotes, getNoteById } from '../Controllers/notesController.js';
import authenticate from '../middleware/authenticate.js';

const request = express.Router();

export default request;

request.get("/", authenticate, getNotes);
request.get("/:id", authenticate, getNoteById);
request.post("/", authenticate, createNotes);
request.put("/:id", authenticate, updateNotes);
request.delete("/:id", authenticate, deleteNotes);
