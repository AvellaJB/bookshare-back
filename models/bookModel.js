const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  ISBN: String,
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
