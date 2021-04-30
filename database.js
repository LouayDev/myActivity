const mongoose = require("mongoose");
const URI = "mongodb://127.0.0.1:27017/myActivity";

const connection = mongoose.createConnection(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsersSchema = new mongoose.Schema({
  firstName: { type: string, trim: true, default: "" },
  lastName: { type: string, trim: true, default: "" },
  email: { type: string, trim: true, default: "" },
  password: { type: string, trim: true, default: "" },
  date: { type: Date, default: Date.now },
});

const Users = connection.model("Users", UsersSchema);

module.exports = { Users };
