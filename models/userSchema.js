const mongoose = require(`mongoose`);

const User = mongoose.model(
  `User`,
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 9,
      maxlength: 12,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    premium: {
      type: Boolean,
      default: false,
    },
  })
);

exports.User = User;
