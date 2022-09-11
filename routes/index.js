var express = require("express");
const friendsController = require("../controllers/Friends");
const userController = require("../controllers/User");
const BookSharingController = require("../controllers/BookSharing");
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

router.post("/friends-library", userController.getFriendsLibrary);

router.post("/review-book", userController.reviewBook);

router.post("/comment-book", userController.CommentBook);

router.post("/find-book", userController.FindBook);

router.post("/delete-comment", userController.DeleteComment);

router.post("/get-one-user", userController.getUserInfoById);

router.post("/borrow-book-request", BookSharingController.BorrowRequest);

router.post(
  "/accept-borrow-request",
  BookSharingController.AcceptBorrowRequest
);
router.post(
  "/reject-borrow-request",
  BookSharingController.RejectBorrowRequest
);
router.post("/recover-book", BookSharingController.RecoverBook);

router.post("/book-request-list", BookSharingController.getBookRequestList);

router.post(
  "/books-lended-borrowed",
  BookSharingController.getBooksBorrowedAndLended
);

module.exports = router;
