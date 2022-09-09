const mongoose = require("mongoose");

const bookLendingSchema = new mongoose.Schema({
  borrower: { type: mongoose.Types.ObjectId, ref: "user" },
  owner: { type: mongoose.Types.ObjectId, ref: "user" },
  book: { type: mongoose.Types.ObjectId, ref: "book" },
  status: {
    type: Number,
    enums: [
      0, //'available',
      1, //'requested',
      2, //'pending',
      3, //'lended'
    ],
  },
});

const bookLendingModel = mongoose.model("bookLending", bookLendingSchema);

module.exports = bookLendingModel;
