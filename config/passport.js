const Localstratigy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
//imporing our model
const Users = require("../models/Users");

module.exports = (passport) => {
  passport.use(
    new Localstratigy({ usernameField: "email" }, (email, password, done) => {
      Users.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return (
              done(null, false), { message: "there is no user with this email" }
            );
          }

          bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: "password incorrect" });
            }
          });
        })
        .catch((err) => done(err));
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
