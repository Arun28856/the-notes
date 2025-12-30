import note from "../models/note.js";

export async function getNotes(_, res) {
    try {
        const notes = await note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getNotes:", error);
        res.status(500).json({ message:"Internal Server Error"})
    }
}

export async function getNoteById(req, res) {
    try {
        const getNoteById = await note.findById(req.params.id);
        if (!getNoteById) return res.status(404).json({message: "Note not found"});
        res.status(200).json(getNoteById);
    } catch (error) {
        console.error("Error while fetching note by ID:", error);
        res.status(500).json({message: "Internal Server Error"});
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
        const updatedNote = await note.findByIdAndUpdate(req.params.id, {title, content}, {new: true});

        if (!updatedNote) return res.status(404).json({message: "Note not found"});

        res.status(200).json({message: "Note updated successfully"});
    } catch (error) {
        console.error("Error while updating note:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function deleteNotes(req, res) {
    try {
        const {title, content} = req.body;
        const deletedNote = await note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json({message: "Note deleted succesfully"});
    } catch (error) {
        console.error("Error while deleting note:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}