const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");

const { body } = require("express-validator");
const { isUser } = require("../MiddleWare/IsUser");
const { upload } = require("../MiddleWare/fileUpload");

const UserRouter = express.Router();

// UserRouter.post(
//   "/create/user",
//   body("UserName").notEmpty().withMessage("UserName is Required"),
//   body("UserNumber").notEmpty().withMessage("UserNumber is Required"),
//   body("StartDate").notEmpty().withMessage("StartDate is Required"),
//   body("room").notEmpty().withMessage("Room Id is Required"),
//   body("Amount").notEmpty().withMessage("Amount is Required"),
//   body("NumberOfmonth").notEmpty().withMessage("NumberOfMonth is Required"),
//   body("branch").notEmpty().withMessage("branch id is Required"),

// );



module.exports = UserRouter;
