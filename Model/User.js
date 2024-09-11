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
    UserNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Customer", UserSchema);

module.exports = UserModel;
