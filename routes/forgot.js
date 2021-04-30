const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("forgot.ejs");
});

module.exports = router;
