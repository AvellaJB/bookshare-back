var express = require("express");
const friendsController = require("../controllers/Friends");
const userController = require("../controllers/User");
var router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Salut");
});

router.post("/register", userController.saveUserToDB);

router.get("/users", userController.getUsersFromDB);

router.post("/add-book", checkAuth, userController.saveBookToDB);

router.delete("/:id", checkAuth, userController.deleteBookToDB);

router.get("/bibliotheque", checkAuth, userController.getUserBooks);

router.post("/login", userController.loginUser);

router.post("/add-friend", friendsController.friendRequest);

router.post("/accept-friend-request", friendsController.AcceptFriendRequest);

router.post("/reject-friend-request", friendsController.RejectFriendRequest);

router.post("/friend-list", userController.getMyFriendsList);

router.post("/user-query", userController.getUsersByName);

router.post("/friend-requests", userController.getMyFriendRequests);

module.exports = router;
