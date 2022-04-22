var express = require("express");
const userController = require("../controllers/User");
const bookModel = require("../models/bookModel");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Salut");
});

router.post("/register", userController.saveUserToDB);

router.get("/register", userController.getUsersFromDB);

router.post("/add-book", userController.saveBookToDB);

router.get("/bibliotheque", userController.getUserBooks);

router.post("/login", userController.loginUser);

module.exports = router;
