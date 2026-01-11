import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: [String],
    isPinned: {
        type: Boolean,
        default: false
    },
    color: String
},
    { timestamps: true }
);

const note = mongoose.model("note", noteSchema);

export default note;