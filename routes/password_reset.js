const express = require("express");
const router = express.Router();
const url = require("url");
const bcrypt = require("bcrypt");
const { isNotAuthenticated } = require("../config/auth");
//importing the token model
const Token = require("../models/token.model");
//importing the users model
const Users = require("../models/Users");

router.get("/", isNotAuthenticated, checkIsValid, (req, res) => {
  res.render("reset");
});

router.post("/", checkIsValid, (req, res) => {
  const userId = req.query.id;
  const resetToken = req.query.token;
  const { password, password2 } = req.body;

  let errors = [];

  if (!password || !password2) {
    errors.push("you need to fill everything");
  }

  if (password !== password2) {
    errors.push("passwords do not match");
  }

  if (password.length < 6) {
    errors.push("password needs to be at least 6 charachters long");
  }

  if (errors.length > 0) {
    return errors.forEach((err) => {
      req.flash("error_msg", err);
      res.redirect(`/reset_password?token=${resetToken}&id=${userId}`);
    });
  }

  //hasing the new password and updating it int he database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      Users.updateOne(
        { _id: userId },
        {
          $set: { password: hash },
        },
        { new: true }
      )
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    });
  });

  //deleting the reste password token fromt the database
  Token.deleteOne({ userId: userId })
    .then((result) => console.log(result))
    .catch((err) => consol.log(err.message));

  //redirecting the user to the login page and displaying a sucess message
  req.flash(
    "success_msg",
    "your password is successfuly updated adn you can login"
  );
  res.redirect("/login");
});

function checkIsValid(req, res, next) {
  const userId = req.query.id;
  const resetToken = req.query.token;

  Token.findOne({ userId: userId }).then((data) => {
    if (!data) {
      req.flash(
        "error_msg",
        "the token is invalid, request another reset password mail"
      );
      return res.redirect("/forgot");
    }
    const { token } = data;

    //checking if the token exists
    if (!token) {
      req.flash(
        "error_msg",
        "the token is invalid, request another reset password mail"
      );
      return res.redirect("/forgot");
    }

    //checking if the token is valid
    bcrypt.compare(resetToken, token, function (err, result) {
      if (result) {
        req.flash(
          "error_msg",
          "the token is invalid, request another reset password mail"
        );
        return res.redirect("/forgot");
      }
    });

    next();
  });
}

module.exports = router;
