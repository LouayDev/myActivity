if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("express-flash");
const passport = require("passport");
const db = require("./config/keys.js").mongoURI;

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

//database setup

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions",
});
// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
  })
);

//init passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// the routes -------------------//
app.use("/", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/forgot", require("./routes/forgot"));
app.use("/reset_password", require("./routes/password_reset"));
app.use("/dashboard", require("./routes/dashboard"));
