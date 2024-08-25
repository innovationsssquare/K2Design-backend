const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SuperAdminModel = mongoose.model("SuperAdmin", SuperAdminSchema);
module.exports = SuperAdminModel;
