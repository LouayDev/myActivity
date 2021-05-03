if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("express-flash");

//general setup  --------------//
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("server running on :", "http://localhost:5000"));
//alowing our app to parse the url
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//using the ejs
app.use(expressLayouts);
app.set("view engine", "ejs");
//setting a static folder
app.use(express.static("./public"));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//database setup
const db = require("./config/keys.js").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// the routes -------------------//
app.use("/", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/forgot", require("./routes/forgot"));
app.use("/reset_password", require("./routes/password_reset"));
app.use("/dasboard", require("./routes/dashboard"));
