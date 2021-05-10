const Localstratigy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
//imporing our model
const Users = require("../models/Users");

module.exports = (passport) => {
  passport.use(
    new Localstratigy({ usernameField: "email" }, (email, password, done) => {
      Users.findOne({ email: email }, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false);
        }

        if (!user.confirmed) {
          return done(null, false);
        }

        bcrypt.compare(password, user.password, function (er, result) {
          if (er) {
            return done(er);
          }
          if (result) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });
};
