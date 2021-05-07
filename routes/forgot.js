if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const { isNotAuthenticated } = require("../config/auth");
//importing the users model
const Users = require("../models/Users");
//importing the reset email API
const { sendResetEmailAPI } = require("../config/APIs");
//importing the token model
const Token = require("../models/token.model");

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("forgot");
});

router.post("/", (req, res) => {
  Users.findOne({ email: req.body.email }).then((user) => {
    //checking if the email that passed is vaild
    if (!user) {
      req.flash("error_msg", "there is no user with this email");
      res.redirect("/forgot");
    }

    Token.findOne({ userId: user._id }).then((data) => {
      console.log(user._id);
      if (data) {
        console.log("token exists bitch");
        req.flash(
          "error_msg",
          "we have already sent reset email to you, try again after 20 minuts"
        );
        res.redirect("/forgot");
      } else {
        sendResetEmailAPI(user._id, Users);
        req.flash("success_msg", "the verification email has been sent to you");
        res.redirect("/forgot");
      }
    });
  });
});

module.exports = router;
