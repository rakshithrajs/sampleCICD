// Importing Models
const Note = require("../models/note");

// Controllers

// To retrieve all notes from the database
const get_all_notes = (req, res) => {
    Note.find()
        .sort({ createdAt: -1 })
        .then((result) => {
            if (result.length > 0) {
                res.json({
                    msg: "All notes have been fetched successfully!",
                    content: result,
                });
            } else {
                res.json({ msg: "No notes to show!" });
            }
        })
        .catch((error) => res.json({ msg: error.message }));
};

// To add a new note to the database
const add_note = async (req, res) => {
    let note = new Note(req.body);
    await note
        .save()
        .then((result) => {
            res.json({
                msg: "Your note was saved successfully!",
                content: result,
            });
        })
        .catch((error) => res.json({ msg: error.message }));
};

// To retrive a single note by its ID
const get_one_note = (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then((result) => {
            if (result != null) {
                res.json({
                    msg: "The note was fetched successfully!",
                    content: result,
                });
            } else {
                res.json({ msg: "This note doesn't exits!" });
            }
        })
        .catch((error) => res.json({ msg: error.message }));
};

// To edit an existing note
const update_note = async (req, res) => {
    const id = req.params.id;
    await Note.findByIdAndUpdate(id, req.body, { new: true })
        .then((result) => {
            if (result != null) {
                res.json({
                    msg: "The note was updated successfully!",
                    content: result,
                });
            } else {
                res.json({ msg: "This note doesn't exist!" });
            }
        })
        .catch((error) => res.json({ msg: error.message }));
};

// To delete a note from the database
const delete_note = async (req, res) => {
    const id = req.params.id;
    await Note.findByIdAndDelete(id)
        .then((result) => {
            if (result != null) {
                res.json({ msg: "The note was successfully deleted!" });
            } else {
                res.json({ msg: "This note doesn't exist!" });
            }
        })
        .catch((error) => res.json({ msg: error.message }));
};

const delete_all_notes = async (req, res) => {
    await Note.deleteMany({})
        .then((result) => {
            res.json({ msg: "All notes were successfully deleted!" });
        })
        .catch((error) => res.json({ msg: error.message }));
};

// Exports
module.exports = {
    get_all_notes,
    add_note,
    get_one_note,
    update_note,
    delete_note,
    delete_all_notes,
};
