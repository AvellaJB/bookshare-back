const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const friendModel = require("../models/friendModel");
const { default: mongoose } = require("mongoose");

const salts = 10;

async function saveUserToDB(req, res) {
  const { pseudo, mail, password, confirmPassword } = req.body;
  // a-t-on toutes les variables nécessaires ?
  if (!pseudo) return res.sendStatus(400);
  if (!mail) return res.sendStatus(400);
  if (!password) return res.sendStatus(400);
  if (!confirmPassword) return res.sendStatus(400);
  // password = confirmPassword ?
  if (password !== confirmPassword) return res.sendStatus(400);

  const hashedPassword = await bcrypt.hash(password, salts);

  // vérifier que l'utilisateur n'existe pas
  const result = await userModel.find({ mail });
  const creationPossible = result.length === 0;
  if (creationPossible) {
    try {
      await userModel.create({
        pseudo,
        mail,
        password: hashedPassword,
      });
    } catch (err) {
      return res.sendStatus(500);
    }
    res.sendStatus(201);
  } else {
    res.status(400);
    res.send("Utilisateur déjà existant");
  }
}

/* GET users listing. */
function getUsersFromDB(req, res, next) {
  userModel
    .find()
    .select("-password -friends -friendRequests -__v")
    .then((usersList) => {
      res.send(usersList);
    });
}

function saveBookToDB(req, res) {
  const { ISBN } = req.body;
  const user = req.user;
  bookModel
    .create({
      user: user.id,
      ISBN,
    })
    .then(() => {
      console.log("Succesfully sent to DB");
      res.send("Client bien reçu en DB");
    })
    .catch(() => {
      res.sendStatus(500);
    });
}

function deleteBookToDB(req, res) {
  console.log(req.params.id);

  bookModel
    .findByIdAndDelete(req.params.id)
    .then(() => {
      console.log("Succesfully delete to DB");
      res.send("Client bien supprimé en DB");
    })
    .catch(() => {
      res.sendStatus(500);
    });
}

function getUserBooks(req, res) {
  const user = req.user;

  bookModel
    .find({ user: user.id })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function loginUser(req, res) {
  const { mail, password } = req.body;

  if (!mail || !password) return res.sendStatus(400);

  const user = await userModel.findOne({ mail });
  const passwordLessUser = await userModel
    .findOne({ mail })
    .select("-password");

  if (user === null) {
    res.status(400);
    return res.send("Vous n'etes pas inscrit.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  const token = jwt.sign({ id: user._id }, process.env.SECRET);

  if (isMatch) res.send({ jwt: token, userInfo: passwordLessUser });
  else {
    res.status(400);
    res.send("Mot de passe incorrect.");
  }
}

async function getMyFriendsList(req, res) {
  const { currentUser } = req.body;

  const user = await userModel
    .findById({ _id: currentUser })
    .populate({ path: "friends", select: "pseudo _id mail" });

  res.send(user.friends);
}

async function getMyFriendRequests(req, res) {
  const { currentUser } = req.body;

  /*   const user = await userModel
    .findById({ _id: currentUser })
    .populate({ path: "friendRequests" }); */

  const Requests = await friendModel
    .find({ requester: currentUser })
    .populate({ path: "recipient", select: "pseudo _id mail" });

  res.send(Requests);
}

//prettier-ignore

async function getUsersByName(req, res) {
  const { pseudo } = req.body;
  const results =  await userModel.find({pseudo: {$regex: '.*' + pseudo +'.*'  }}).select("pseudo mail");
  res.send(results);
}

function getFriendsLibrary(req, res) {
  const { id } = req.body;
  bookModel
    .find({ user: id })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function UpdateBook(req, res) {
  const { userReview, id } = req.body;
  const update = await bookModel
    .findByIdAndUpdate({ _id: id }, { userReview: userReview })
    .then((result) => res.send(result))
    .catch((err) => {
      res.send(err);
    });
}

async function CommentBook(req, res) {
  const { bookId, comment, friend } = req.body;
  const update = await bookModel
    .findByIdAndUpdate(
      { _id: bookId },
      {
        $push: {
          comments: { comment: comment, user: friend },
        },
      }
    )
    .then((res) => res.send(res))
    .catch((err) => res.send(err));
}

const userController = {
  saveUserToDB,
  getUsersFromDB,
  saveBookToDB,
  getUserBooks,
  loginUser,
  deleteBookToDB,
  getMyFriendsList,
  getUsersByName,
  getMyFriendRequests,
  getFriendsLibrary,
  UpdateBook,
  CommentBook,
};

module.exports = userController;
