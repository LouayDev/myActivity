const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isNotAuthenticated } = require("../config/auth");
const flash = require("express-flash");

router.get("/", isNotAuthenticated, (req, res) => {
  console.log(req.flash("error"));
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureMessage: "you are crazy'",
    failureFlash: true,
  })
);
module.exports = router;
