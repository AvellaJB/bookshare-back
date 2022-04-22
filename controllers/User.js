const bcrypt = require("bcrypt");

const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");

function saveUserToDB(req, res) {
  const { pseudo, mail, password } = req.body;
  userModel
    .create({
      pseudo,
      mail,
      password,
    })
    .then(() => {
      console.log("Succesfully sent to DB");
      res.send("Client bien reçu en DB");
    })
    .catch(() => {
      res.sendStatus(500);
    });
}

/* GET users listing. */
function getUsersFromDB(req, res, next) {
  userModel.find().then((usersList) => {
    res.send(usersList);
  });
}

function saveBookToDB(req, res) {
  const { user, ISBN } = req.body;
  bookModel
    .create({
      user,
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

function getUserBooks(req, res) {
  bookModel
    .find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function loginUser(req, res) {
  const { pseudo, mail, password } = req.body;

  if (!mail || !password || !pseudo) return res.sendStatus(400);

  const user = await userModel.findOne({ mail });

  if (user === null) {
    res.status(400);
    return res.send("Vous n'etes pas inscrit.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) res.send("Vous êtes connecté");
  else {
    res.sendStatus(400);
    res.send("Mot de passe incorrect.");
  }
}

const userController = {
  saveUserToDB,
  getUsersFromDB,
  saveBookToDB,
  getUserBooks,
  loginUser,
};

module.exports = userController;
