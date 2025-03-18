const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: true,
  },
  isAdmin:{
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type:Date,
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  status:{
    type: Boolean,
    default: true,
  },
  bio: {
    type: String,
    required: false,
  },
  picture: {
    type: String,
    required: false,
    default:"/images/default.png"
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
