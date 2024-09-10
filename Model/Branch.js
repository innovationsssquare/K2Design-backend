const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BranchModel = mongoose.model("Branch", BranchSchema);
module.exports = BranchModel;
