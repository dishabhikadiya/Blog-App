const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Pleace Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Pleace Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Pleace Enter a validetor Email"],
  },
  password: {
    type: String,
    required: true,
    message: "pleace enter your password",
  },
  token: {
    type: String,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
