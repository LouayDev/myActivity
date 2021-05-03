const express = require("express");
const router = express.Router();
const passport = require("passport");

router.delete("/", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
