import note from "../models/note.js";

export async function getNotes(req, res) {
    try {
        const notes = await note.find();
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getNotes:", error);
        res.status(500).json({ message:"Internal Server Error"})
    }
}

export async function createNotes(req, res) {
    try {
        const {title, content} = req.body;
        const newNote = new note({title, content});
        await newNote.save();
        res.status(201).json({message: "Note created successfully"});
    } catch (error) {
        console.error("Error while creating note:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function updateNotes(req, res) {
    try {
        const {title, content} = req.body;
        await note.findByIdAndUpdate(req.params.id, {title, content});
        res.status(200).json({message: "Note updated successfully"});
    } catch (error) {
        console.error("Error while updating note:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function deleteNotes(req, res) {
    try {
        const {title, content} = req.body;
        await note.findByIdAndDelete(req.params.id, {title, content});
        res.status(200).json({message: "Note deleted succesfully"});
    } catch (error) {
        console.error("Error while deleting note:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}