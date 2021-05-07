const express = require("express");
const router = express.Router();
//importing the Users model
const Users = require("../models/Users");
//importing auth
const bcrypt = require("bcrypt");
const { isNotAuthenticated, isActivated } = require("../config/auth");
//importing the activate account email API
const { activateAccountAPI } = require("../config/APIs");
router.get("/", isNotAuthenticated, (req, res) => {
  res.render("register");
});

//register
router.post("/register", isNotAuthenticated, isActivated, (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !password || !password2) {
    errors.push({ msg: "you need to fill everything" });
  }

  if (password !== password2) {
    errors.push({ msg: "passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "password needs to be at least 6 charachters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstName,
      lastName,
      email,
      password,
      password2,
    });
  } else {
    Users.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "the email already exists" });
        res.render("register", {
          errors,
          firstName,
          lastName,
          email,
          password,
          password2,
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            const newUser = new Users({
              firstName,
              lastName,
              email,
              password: hash,
            });
            newUser
              .save()
              .then((user) => activateAccountAPI(user.id, user.firstName));
          });
        });

        req.flash("suces_msg", "email has been sent to confirm your account");
        res.redirect("/register");
      }
    });
  }
});

module.exports = router;
