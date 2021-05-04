if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
let jwt = require("jsonwebtoken");
const { isNotAuthenticated } = require("../config/auth");
const url = require("url");
const nodemailer = require("nodemailer");
//importing the users model
const Users = require("../models/Users");

router.get("/", isNotAuthenticated, (req, res) => {
  res.render("forgot");
});

router.post("/", (req, res) => {
  Users.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      req.flash("error_msg", "there is no user with this email");
      res.redirect("/forgot");
    }
  });

  const { email } = req.body;

  let token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: "1h", // expires in 1 hours
  });

  const smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    requireTLS: true,
    secure: true, // use SSL
    auth: {
      user: "amrou.123.gg@gmail.com",
      pass: "amrou.gmail.2003",
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  // setup e-mail data with unicode symbols
  const mailOptions = {
    from: '"Fred Foo 👥" <amrou.123.gg@gmail.com>', // sender address
    to: "amrou.123.gg@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world 🐴", // plaintext body
    html: `<h2>Hello world 🐴, your token is => ${token}</h2>`, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
  });

  req.flash("success_msg", "the verification email has been sent to you");
  res.redirect("/forgot");
});

module.exports = router;
