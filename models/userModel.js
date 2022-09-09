const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: String,
  mail: String,
  password: String,
  friendRequests: [{ type: mongoose.Types.ObjectId, ref: "friendRequests" }],
  friends: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  books_borrowed: [{ type: mongoose.Types.ObjectId, ref: "book" }],
  books_lended: [
    {
      book: { type: mongoose.Types.ObjectId, ref: "book" },
      borrower: { type: mongoose.Types.ObjectId, ref: "user" },
    },
  ],
  bookRequests: [{ type: mongoose.Types.ObjectId, ref: "bookLending" }],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
