const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  ISBN: String,
  userReview: String,
  comments: [
    { comment: String, user: { type: mongoose.Types.ObjectId, ref: "user" } },
  ],
  book_status: {
    type: Number,
    enums: [
      0, //'available',
      1, // 'lended',
      2, // 'unavailable'
    ],
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
