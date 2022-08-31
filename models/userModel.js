const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: String,
  mail: String,
  password: String,
  friendRequests: [{ type: mongoose.Types.ObjectId, ref: "FriendRequests" }],
  friends: [{ type: mongoose.Types.ObjectId, ref: "user" }],
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
