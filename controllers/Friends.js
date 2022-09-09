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
    { $push: { friendRequests: docRequester._id } }
  );
  const updateRecipient = await userModel.findOneAndUpdate(
    { _id: recipient },
    { $push: { friendRequests: docRecipient._id } }
  );

  res.send("Request sent");
}

async function AcceptFriendRequest(req, res) {
  const { requester, recipient } = req.body;

  //On récupère les friendRequest du point de vue du requester et du recipient
  const RequesterFriendRequest = await friendModel.findOne({
    requester: requester,
    recipient: recipient,
  });
  const RecipientFriendRequest = await friendModel.findOne({
    requester: recipient,
    recipient: requester,
  });

  //On delete dans le user, les friendsRequest :
  const updateUserRecipientFriendRequest = await userModel.findOneAndUpdate(
    { _id: recipient },
    {
      $pull: {
        friendRequests: mongoose.Types.ObjectId(RecipientFriendRequest),
      },
    }
  );
  const updateUserRequesterFriendRequest = await userModel.findOneAndUpdate(
    { _id: requester },
    {
      $pull: {
        friendRequests: mongoose.Types.ObjectId(RequesterFriendRequest),
      },
    }
  );

  //On update le friendList

  const updateRecipientFriendList = await userModel.findOneAndUpdate(
    { _id: recipient },
    {
      $push: { friends: mongoose.Types.ObjectId(requester) },
    }
  );

  const updateRequesterFriendList = await userModel.findOneAndUpdate(
    { _id: requester },
    {
      $push: { friends: mongoose.Types.ObjectId(recipient) },
    }
  );

  //On delete la friendRequest
  const deleteRecipientsFriendRequest = await friendModel.findOneAndDelete(
    { requester: requester, recipient: recipient },
    {
      $set: { status: 3 },
    }
  );

  //On update également la liste d'amis du requested.
  const deleteRequestersFriendRequest = await friendModel.findOneAndDelete(
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

const friendsController = {
  friendRequest,
  AcceptFriendRequest,
  RejectFriendRequest,
};

module.exports = friendsController;
