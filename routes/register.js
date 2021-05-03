const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
//importing the Users model
const Users = require("../models/Users");
//importing auth
const { isNotAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  res.render("register");
});

//register
router.post("/register", isNotAuthenticated, (req, res) => {
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
        const newUser = new Users({
          firstName,
          lastName,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "you are now successfully registered and can login"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err.message));
          });
        });
      }
    });
  }
});

module.exports = router;
