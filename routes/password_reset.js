const express = require("express");
const router = express.Router();
const { isNotAuthenticated } = require("../config/auth");

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("reset");
});

module.exports = router;
