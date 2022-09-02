const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
  requester: { type: mongoose.Types.ObjectId, ref: "user" },
  recipient: { type: mongoose.Types.ObjectId, ref: "user" },
  status: {
    type: Number,
    enums: [
      0, //'add friend',
      1, //'requested',
      2, //'pending',
      3, //'friends'
    ],
  },
});

const friendModel = mongoose.model("friendRequests", friendsSchema);

module.exports = friendModel;
