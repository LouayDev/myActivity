const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isNotAuthenticated } = require("../config/auth");
const flash = require("express-flash");
const express = require("express");
const app = express();
app.use(flash());

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
    failureFlash: true,
    failWithError: true,
    failureMessage: true,
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);
module.exports = router;
