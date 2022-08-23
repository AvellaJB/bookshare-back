const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: String,
  mail: String,
  password: String,
  friends: [{ type: mongoose.Types.ObjectId, ref: "Friends" }],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
