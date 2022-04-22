const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

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
    res.status(400);
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
