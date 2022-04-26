var express = require("express");
const userController = require("../controllers/User");
var router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Salut");
});

router.post("/register", userController.saveUserToDB);

router.get("/register", userController.getUsersFromDB);

router.post("/add-book", checkAuth, userController.saveBookToDB);

router.delete("/:id", checkAuth, userController.deleteBookToDB);

router.get("/bibliotheque", checkAuth, userController.getUserBooks);

router.post("/login", userController.loginUser);

module.exports = router;
