const mongoose = require("mongoose");
const Users = require("../models/Users");

module.exports = {
  isAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.isAuthenticated());
      return next();
    }
    req.flash("error_msg", "you need to login to acess dashboard");
    res.redirect("/login");
  },

  isNotAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },

  isActivated: function (req, res, next) {
    const { email } = req.body.email;

    Users.findOne({ email: email }).then((user) => {
      if (!user) {
        return next();
      }
      if (!user.confirmed) {
        return req.flash("error_msg", "you need to activate your account");
        res.redirect("/login");
      }

      next();
    });
  },
};
