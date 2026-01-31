import note from "../models/note.js";

export async function getNotes(req, res) {
    try {
        const notes = await note.find({ userId: req.user.uid }).sort({ createdAt: -1 });
        const notes = await note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getNotes:", error?.message ?? error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getNoteById(req, res) {
    try {
        const foundNote = await note.findById(req.params.id);
        if (!foundNote) return res.status(404).json({ message: "Note not found" });
        if (foundNote.userId !== req.user.uid) return res.status(403).json({ message: "Forbidden" });
        res.status(200).json(foundNote);
    } catch (error) {
        console.error("Error while fetching note by ID:", error?.message ?? error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createNotes(req, res) {
    try {
        const { title, content } = req.body;
        const newNote = new note({
            title,
            content,
            userId: req.user.uid,
        const {title, content} = req.body;
        const newNote = new note({
            title, 
            content,
            userId: req.user.userId
        });
        await newNote.save();
        res.status(201).json({ message: "Note created successfully" });
    } catch (error) {
        console.error("Error while creating note:", error?.message ?? error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateNotes(req, res) {
    try {
        const existing = await note.findOne({ _id: req.params.id, userId: req.user.uid });
        if (!existing) return res.status(404).json({ message: "Note not found" });
        const { title, content } = req.body;
        await note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
        console.error("Error while updating note:", error?.message ?? error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteNotes(req, res) {
    try {
        const deletedNote = await note.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error while deleting note:", error?.message ?? error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
