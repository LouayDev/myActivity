if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

//general setup up the server --------------//
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("server running on :", "http://localhost:5000"));
//alowing our app to parse the url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//using the ejs
app.set("view-engine", "ejs");
