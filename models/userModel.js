const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  pseudo: String,
  mail: String,
  password: String,
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
