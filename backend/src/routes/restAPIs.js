import express from 'express';
import { getNotes, createNotes, updateNotes, deleteNotes, getNoteById } from '../Controllers/notesController.js';

const request = express.Router();

export default request;

request.get("/", getNotes);
request.get("/:id", getNoteById );
request.post("/", createNotes);
request.put("/:id", updateNotes);
request.delete("/:id", deleteNotes);
