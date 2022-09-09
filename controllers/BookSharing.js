const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const friendModel = require("../models/friendModel");
const bookLendingModel = require("../models/bookLendingModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

async function BorrowRequest(req, res) {
  const { borrower, owner, book } = req.body;

  //On crée une demande appartenant à l'owner
  const docOwner = await bookLendingModel.findOneAndUpdate(
    {
      borrower: borrower,
      owner: owner,
      book: book,
    },
    {
      $set: { status: 1 },
    },
    { upsert: true, new: true }
  );
  //On crée une demande appartenant au borrower
  const docBorrower = await bookLendingModel.findOneAndUpdate(
    {
      borrower: owner,
      owner: borrower,
      book: book,
    },
    {
      $set: { status: 2 },
    },
    { upsert: true, new: true }
  );

  //On ajoute à la liste des demandes du borrower;

  const updateOwner = await userModel.findOneAndUpdate(
    { _id: owner },
    { $push: { bookRequests: docOwner._id } }
  );
  const updateBorrower = await userModel.findOneAndUpdate(
    { _id: borrower },
    { $push: { bookRequests: docBorrower._id } }
  );

  res.send("Demande de prêt envoyée");
}

async function AcceptBorrowRequest(req, res) {
  const { owner, borrower, book } = req.body;

  const bookRequestOwner = await bookLendingModel.findOne({
    borrower: borrower,
    owner: owner,
  });
  const bookRequestBorrower = await bookLendingModel.findOne({
    borrower: owner,
    owner: borrower,
  });

  //On delete dans le user, les friendsRequest :
  const updateBorrowRequestOwner = await userModel.findOneAndUpdate(
    { _id: owner },
    {
      $pull: {
        bookRequests: mongoose.Types.ObjectId(bookRequestOwner),
      },
    }
  );
  const updateBorrowRequestBorrower = await userModel.findOneAndUpdate(
    { _id: borrower },
    {
      $pull: {
        bookRequests: mongoose.Types.ObjectId(bookRequestBorrower),
      },
    }
  );

  // On ajoute dans le user le livre emprunté et prêté.
  const updateOwner = await userModel.findOneAndUpdate(
    {
      _id: owner,
    },
    {
      $push: { books_lended: { book: book, borrower: borrower } },
    }
  );
  const updateBorrower = await userModel.findOneAndUpdate(
    {
      _id: borrower,
    },
    {
      $push: { books_borrowed: book },
    }
  );

  //On delete la friendRequest
  const deleteOwnerBookRequest = await bookLendingModel.findOneAndDelete({
    owner: owner,
    borrower: borrower,
  });
  const deleteBorrowerBookRequest = await bookLendingModel.findOneAndDelete({
    owner: borrower,
    borrower: owner,
  });

  const updateBookStatus = await bookModel.findOneAndUpdate(
    {
      _id: book,
    },
    {
      book_status: 2,
    }
  );

  res.sendStatus(200);
}

async function RejectBorrowRequest(req, res) {
  const { borrower, owner, book } = req.body;

  //On delete la friendRequest
  const deleteOwnerBookRequest = await bookLendingModel.findOneAndDelete({
    owner: owner,
    borrower: borrower,
  });
  const deleteBorrowerBookRequest = await bookLendingModel.findOneAndDelete({
    owner: borrower,
    borrower: owner,
  });

  // On ajoute dans le user le livre emprunté et prêté.
  const updateOwner = await userModel.findOneAndUpdate(
    {
      _id: owner,
    },
    {
      $pull: { books_lended: book },
    }
  );
  const updateBorrower = await userModel.findOneAndUpdate(
    {
      _id: borrower,
    },
    {
      $pull: { books_borrowed: book },
    }
  );
}

async function RecoverBook(req, res) {
  const { borrower, owner, book } = req.body;

  // On ajoute dans le user le livre emprunté et prêté.
  const updateOwner = await userModel.findOneAndUpdate(
    {
      _id: owner,
    },
    {
      $pull: { books_lended: book },
    }
  );
  const updateBorrower = await userModel.findOneAndUpdate(
    {
      _id: borrower,
    },
    {
      $pull: { books_borrowed: book },
    }
  );

  const updateBookStatus = await bookModel.findOneAndUpdate(
    {
      _id: book,
    },
    {
      book_status: 1,
    }
  );

  res.sendStatus(200);
}

const BookSharingController = {
  BorrowRequest,
  AcceptBorrowRequest,
  RecoverBook,
  RejectBorrowRequest,
};

module.exports = BookSharingController;
