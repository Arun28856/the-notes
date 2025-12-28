import express from 'express';
import { getNotes, postNotes, putNotes, deleteNotes } from './Controllers/notesController.js';

const request = express.Router();

export default request;

request.get("/", getNotes);
request.post("/", postNotes);
request.put("/:id", putNotes);
request.delete("/:id", deleteNotes);
