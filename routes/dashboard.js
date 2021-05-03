const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../config/auth");

router.get("/", isAuthenticated, (req, res) => {
  const user = req.user;
  res.render("dashboard", {
    user: user,
  });
  console.log(req.user);
});

module.exports = router;
