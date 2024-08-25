const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
    },
    Email: {
      type: String,
    },
    UserId: {
      type: String,
      required: true,
    },
    UserNumber: {
      type: Number,
      required: true,
    },
    BookedDate: {
      type: Date,
      required: true,
    },
    StartDate: {
      type: String,
      required: true,
    },
    LastDate: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    devicetoken: {
      type: String
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("teantants", UserSchema);

module.exports = UserModel;
