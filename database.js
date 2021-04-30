const mongoose = require("mongoose");
const URI = "mongodb://127.0.0.1:27017/myActivity";

const connection = mongoose.createConnection(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
