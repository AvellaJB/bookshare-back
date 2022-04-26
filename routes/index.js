var express = require("express");
const userController = require("../controllers/User");
var router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
const bookModel = require("../models/bookModel");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Salut");
});

router.post("/register", userController.saveUserToDB);

router.get("/register", userController.getUsersFromDB);

router.post("/add-book", checkAuth, userController.saveBookToDB);

router.delete("/:id", checkAuth, (req, res) => {
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
});

router.get("/bibliotheque", checkAuth, userController.getUserBooks);

router.post("/login", userController.loginUser);

module.exports = router;
