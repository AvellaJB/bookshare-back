const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  user: String,
  ISBN: String,
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
