const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const getToken = (req) => String(req.get("Authorization")).split(" ")[1];

function checkAuth(req, res, next) {
  const token = getToken(req);

  if (!token) return res.sendStatus(401);

  try {
    const { id } = jwt.verify(token, process.env.SECRET);

    userModel.findById(id).then((user) => {
      req.user = user;

      next();
    });
  } catch {
    res.sendStatus(403);
  }
}

exports.checkAuth = checkAuth;
