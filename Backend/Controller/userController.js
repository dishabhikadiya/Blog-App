const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const bcrypt = require("bcrypt");
const jwtMiddleware = require("../middleware/jwt");
const cookieParser = require("cookie-parser");

// REGISTER USER
exports.register = catchAsyncErrors(async (req, res) => {
  try {
    console.log(req.body);
    console.log("done");
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(409).json({ message: "pleace enter value" });
    }
    const existingUser = await User.findOne({ email: email });
    console.log("existinguser", existingUser);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("new", newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to register user", err });
  }
});

// LOGIN USER

exports.login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(409)
      .json({ message: "Pleace Enter valid Email and Password" });
  }
  try {
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "EFREGDFBY65TGHJU7765GBHNMKUFDVGT5H67JNYTYN5YN65"
    );
    User.token = token;
    console.log("Token :", token);
    await User.updateOne(
      { email: email },
      {
        token: token,
      }
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Failed to log in" });
  }
});

// LOGOUT USERS

exports.logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
