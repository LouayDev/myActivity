const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, default: "" },
  lastName: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, default: "" },
  password: { type: String, trim: true, default: "" },
  date: { type: Date, default: Date.now },
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;
