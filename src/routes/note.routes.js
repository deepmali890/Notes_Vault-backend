const express = require('express');
const noteController = require("../controller/note.controller");
const protect = require('../middleware/auth.middleware');


const router = express.Router();

router.post('/add-note', protect, noteController.addNote);
router.put('/edit-note/:id', protect, noteController.editNote);
router.get('/search-notes', protect, noteController.searchNotes);
router.get('/get-all-notes', protect, noteController.getAllNotes);
router.delete('/delete-note/:id', protect, noteController.deleteNote);


module.exports = router