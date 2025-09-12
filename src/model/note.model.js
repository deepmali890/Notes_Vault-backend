const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags:{
        type: [String],
        default: []
    },
    isPinned:{
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdOn:{
        type: Date,
        default: new Date().getTime()
    }
  
},{timestamps:true})

const Note = mongoose.model('note', noteSchema);

module.exports = Note;