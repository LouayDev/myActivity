if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  const { user: userId } = jwt.verify(req.query.token, process.env.JWT_SECRET);

  console.log(userId);

  Users.updateOne(
    { _id: userId },
    {
      $set: {
        confirmed: true,
        expireAt: null,
      },
    },
    { new: true }
  )
    .then((result) => console.log(result))
    .catch((err) => console.log(err));

  req.flash("success_msg", "you are now successfully  can login");
  res.redirect("/login");
});

module.exports = router;
