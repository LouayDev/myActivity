if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const utils = require("util");
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
//importing the token model
const Token = require("../models/token.model");

module.exports = {
  sendResetEmailAPI: function (userId, Users) {
    //creating the token
    const resetCode = crypto.randomBytes(32).toString("hex");
    let resetToken = jwt.sign({ resetCode: resetCode }, process.env.JWT_SECRET);

    //creating a new database token and passing it to the token and saving it
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(resetCode, salt, (err, hash) => {
        if (err) throw err;
        const newToken = new Token({
          userId: userId,
          token: hash,
          createdAt: Date.now(),
        });
        newToken.save().catch((err) => console.log(err));
      });
    });

    // the link that will be set in the reset email
    const link = `http://localhost:5000/reset_password?token=${resetToken}&id=${userId}`;

    //seeint the encrypted SMTP trasport cinfigurations
    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 465,
      requireTLS: true,
      secure: true, // use SSL
      auth: {
        user: "amrou.123.gg@gmail.com",
        pass: "amrou.gmail.2003.new",
      },
    };

    //intialozing nodemailer transport
    const transporter = nodemailer.createTransport(smtpConfig);

    const readFile = utils.promisify(fs.readFile);
    readFile(
      "/home/amrouche/Documents/GitHub/myActuvity/emailTemplates/resetPassword.html",
      { encoding: "utf-8" }
    )
      .then((html) => {
        const template = handlebars.compile(html);
        const replacements = {
          link: link,
        };
        const htmlToSend = template(replacements);

        // setup e-mail data with unicode symbols
        const mailOptions = {
          from: '"myActivuty team" <amrou.123.gg@gmail.com>', // sender address
          to: "amrou.123.gg@gmail.com", // list of receivers
          subject: "Reset Password", // Subject line
          text: "resting your password", // plaintext body
          html: htmlToSend,
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: " + info.response);
        });
      })
      .then(() => console.log("you are amazing"))
      .catch((err) => {
        console.log(err);
      });
  },

  activateAccountAPI: function (userId, firstName) {
    jwt.sign(
      { user: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },

      function (err, token) {
        console.log(token);
        // the link that will be set in the reset email
        const link = `http://localhost:5000/activate_account?token=${token}`;

        //seeint the encrypted SMTP trasport cinfigurations
        const smtpConfig = {
          host: "smtp.gmail.com",
          port: 465,
          requireTLS: true,
          secure: true, // use SSL
          auth: {
            user: "amrou.123.gg@gmail.com",
            pass: "amrou.gmail.2003.new",
          },
        };

        //intialozing nodemailer transport
        const transporter = nodemailer.createTransport(smtpConfig);

        const readFile = utils.promisify(fs.readFile);
        readFile(
          "/home/amrouche/Documents/GitHub/myActuvity/emailTemplates/activateAcc.html",
          { encoding: "utf-8" }
        )
          .then((html) => {
            const template = handlebars.compile(html);
            const replacements = {
              name: firstName,
              link: link,
            };
            const htmlToSend = template(replacements);

            // setup e-mail data with unicode symbols
            const mailOptions = {
              from: '"myActivuty team" <amrou.123.gg@gmail.com>',
              to: "amrou.123.gg@gmail.com",
              subject: "Reset Password",
              text: "resting your password",
              html: htmlToSend,
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log("Message sent: " + info.response);
            });
          })
          .then(() => console.log("you are amazing"))
          .catch((err) => {
            console.log(err);
          });
      }
    );
  },
};
