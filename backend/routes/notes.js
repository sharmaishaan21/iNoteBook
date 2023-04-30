const express = require('express');
const fetchUser = require("../middleware/fetchUser")
const Notes = require("../models/Notes");
const { body, validationResult } = require('express-validator');
const router = express.Router();
router.get('/fetchallnotes', fetchUser, async (req, res) => {
   try {
      const notes = await Notes.find({ user: req.user.id })
      res.json(notes);
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured")
   }
})
router.post('/addnote', [
   body('title', 'Enter a valid title').isLength({ min: 3 }),
   body('description', 'Enter a valid description').isLength({ min: 5 })
], fetchUser, async (req, res) => {
   try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
         title, description, tag, user: req.user.id
      })
      const savedNote = await note.save();
      res.json(savedNote);
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured")
   }

})
router.put('/updatenote/:id', fetchUser, async (req, res) => {
   try {
      const { title, description, tag } = req.body;
      // Create a new object.
      const newNote = {};
      if (title) {
         newNote.title = title;
      }
      if (description) {
         newNote.description = description;
      }
      if (tag) {
         newNote.tag = tag
      }
      // Find the node to be updated.
      let note = await Notes.findById(req.params.id);
      if (!note) {
         res.status(404).send("Not found");
      }
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send("Not allowed");
      }
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
      // Setting the value of new to true creates a new new user in case any new individual tries to log in.
      res.json({ note });
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured")
   }
})
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
   try {
      const { title, description, tag } = req.body;
      // Create a new object.
      // Find the node to be deleted.
      let note = await Notes.findById(req.params.id);
      if (!note) {
         res.status(404).send("Not found");
      }
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send("Not allowed");
      }
      note = await Notes.findByIdAndDelete(req.params.id)
      // Setting the value of new to true creates a new new user in case any new individual tries to log in.
      res.json({ "Success": "Note has been deleted.",note:note });
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured")
   }
})

module.exports = router;