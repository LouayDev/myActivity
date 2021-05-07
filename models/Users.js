const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, default: "", unique: true },
  lastName: { type: String, trim: true, default: "", unique: true },
  email: { type: String, trim: true, default: "", unique: true },
  password: { type: String, trim: true, default: "" },
  date: { type: Date, default: Date.now },
  confirmed: { type: Boolean, default: false },
  expireAt: {
    type: Date,
    index: { expires: "1d" },
  },
});

module.exports = mongoose.model("Users", UsersSchema);
