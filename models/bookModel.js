const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  ISBN: String,
  userReview: String,
  comments: [
    { comment: String, user: { type: mongoose.Types.ObjectId, ref: "user" } },
  ],
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
