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

const userController = {
  saveUserToDB,
  saveBookToDB,
  getUserBooks,
};

module.exports = userController;
