const express = require("express");
const { body } = require("express-validator");
const { IsSuperAdmin } = require("../MiddleWare/IsSuperAdmin");
const {
  CreateBranch,
  UpdateBranch,
  GetAllBranch,
  GetSingleBranch,
  totaladminandteants,
} = require("../Controller/Branch");

const BranchRouter = express.Router();

BranchRouter.post(
  "/create/branch",
  body("branchName").notEmpty().withMessage("Branch Name  is required"),
  body("code").notEmpty().withMessage("Branch Code  is required"),
  IsSuperAdmin,
  CreateBranch
);
BranchRouter.put(
  "/update/branch/:id",
  body("branchName").notEmpty().withMessage("Branch Name  is required"),
  body("code").notEmpty().withMessage("Branch Code  is required"),
  IsSuperAdmin,
  UpdateBranch
);
BranchRouter.get("/get/branch", GetAllBranch);
BranchRouter.get("/get/branch/:id", GetSingleBranch);
BranchRouter.get("/get/details/branch/:branchId", totaladminandteants);

module.exports ={ BranchRouter};
