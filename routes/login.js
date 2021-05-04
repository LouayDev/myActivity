const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isNotAuthenticated } = require("../config/auth");

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
    failureeFlash: true,
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);
module.exports = router;
