const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const friendModel = require("../models/friendModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

async function friendRequest(req, res) {
  const { requester, recipient } = req.body;

  //Le premier doc contient la mention requested pour l'user requester
  const docRequester = await friendModel.findOneAndUpdate(
    { requester: requester, recipient: recipient },
    { $set: { status: 1 } },
    { upsert: true, new: true }
  );

  //Le deuxième doc contient la mention pending pour l'user recipient
  const docRecipient = await friendModel.findOneAndUpdate(
    { recipient: requester, requester: recipient },
    { $set: { status: 2 } },
    { upsert: true, new: true }
  );

  const updateRequester = await userModel.findOneAndUpdate(
    { _id: requester },
    { $push: { friends: docRequester._id } }
  );
  const updateRecipient = await userModel.findOneAndUpdate(
    { _id: recipient },
    { $push: { friends: docRecipient._id } }
  );

  res.send("Request sent");
}

async function AcceptFriendRequest(req, res) {
  const { requester, recipient } = req.body;

  //Quand le recipient accept la demander, on update sa liste d'amis
  const updateRecipientsFriends = await friendModel.findOneAndUpdate(
    { requester: requester, recipient: recipient },
    {
      $set: { status: 3 },
    }
  );

  //On update également la liste d'amis du requested.
  const updateRequestersFriends = await friendModel.findOneAndUpdate(
    { recipient: requester, requester: recipient },
    {
      $set: { status: 3 },
    }
  );

  res.sendStatus(200);
}

async function RejectFriendRequest(req, res) {
  const { requester, recipient } = req.body;

  const docRequester = await friendModel.findOneAndRemove({
    requester: requester,
    recipient: recipient,
  });
  const docRecipient = await friendModel.findOneAndRemove({
    recipient: requester,
    requester: recipient,
  });

  const updateRequester = await userModel.findOneAndUpdate(
    { _id: requester },
    { $pull: { friends: docRequester._id } }
  );
  const updateRecipient = await userModel.findOneAndUpdate(
    { _id: recipient },
    { $pull: { friends: docRecipient._id } }
  );

  res.sendStatus(200);
}

async function getFriendsList(req, res) {
  const { currentUser } = req.body;

  let user = userModel.aggregate([
    {
      $lookup: {
        from: friendModel.collection.name,
        let: { friends: "$friends" },
        pipeline: [
          {
            $match: {
              recipient: mongoose.Types.ObjectId(currentUser),
              $expr: { $in: ["$_id", "$$friends"] },
            },
          },
          { $project: { status: 1 } },
        ],
        as: "friends",
      },
    },
    {
      $addFields: {
        friendsStatus: {
          $ifNull: [{ $min: "$friends.status" }, 0],
        },
      },
    },
  ]);
  res.send(user);
}

const friendsController = {
  friendRequest,
  AcceptFriendRequest,
  RejectFriendRequest,
  getFriendsList,
};

module.exports = friendsController;
