const Note = require("../model/note.model");

exports.addNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            user: user._id
        })
        await note.save();
        res.status(201).json({ message: 'Note added successfully', note, success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', success: false });

    }

}

exports.editNote = async (req, res) => {
    const noteId = req.params.id;
    const { title, content, tags, isPinned } = req.body;

    // At least one field should be provided
    if (title === undefined && content === undefined && tags === undefined && isPinned === undefined) {
        return res.status(400).json({ message: 'At least one field is required' });
    }

    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update only provided fields
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();

        res.status(200).json({ message: 'Note updated successfully', note, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: user._id }).sort({ isPinned: -1 });
        res.status(200).json({ message: 'Notes fetched successfully', notes, success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}

exports.deleteNote = async (req, res) => {
    const noteId = req.params.id
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, user: user._id })
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        await note.deleteOne();
        res.status(200).json({ message: 'Note deleted successfully', success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}
exports.searchNotes = async (req, res) => {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const matchingNotes = await Note.find({
            user: user._id,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json({ message: 'Notes fetched successfully', notes: matchingNotes, success: true });


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}