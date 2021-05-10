if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const utils = require("util");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//importing the token model
const Token = require("../models/token.model");
const readFile = utils.promisify(fs.readFile);

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

module.exports = {
  sendResetEmailAPI: async function (userId, Users) {
    //creating the token
    const resetCode = crypto.randomBytes(32).toString("hex");
    let resetToken = jwt.sign({ resetCode: resetCode }, process.env.JWT_SECRET);

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(resetCode, salt, (err, hash) => {
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

    //intialozing nodemailer transport
    const transporter = nodemailer.createTransport(smtpConfig);

    const html = await readFile(
      "/home/amrouche/Documents/GitHub/myActuvity/emailTemplates/resetPassword.html",
      { encoding: "utf-8" }
    );

    const compiledHTML = await handlebars.compile(html);
    const htmlToSend = await compiledHTML({ link: link });

    const mailOptions = {
      from: '"myActivuty team" <amrou.123.gg@gmail.com>',
      to: "amrou.123.gg@gmail.com",
      subject: "Reset Password",
      text: "resting your password",
      html: htmlToSend,
    };

    // send mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: " + info.response);
    });
  },

  activateAccountAPI: async (userId, firstName) => {
    const token = await jwr.sign({ user: userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const link = `http://localhost:5000/activate_account?token=${token}`;

    const html = await readFile(
      "/home/amrouche/Documents/GitHub/myActuvity/emailTemplates/activateAcc.html",
      { encoding: "utf-8" }
    );
    const compiledHTML = await handlebars.compile(html);

    const htmlToSend = compiledHTML({ name: firstName, link: link });

    // setup e-mail data with unicode symbols
    const mailOptions = {
      from: '"myActivuty team" <amrou.123.gg@gmail.com>',
      to: "amrou.123.gg@gmail.com",
      subject: "confirme accounta",
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
  },
};
