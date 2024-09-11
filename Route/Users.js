const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const { body } = require("express-validator");
const {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} = require("../Controller/Users");

const UserRouter = express.Router();

UserRouter.post(
  "/user/create",
  IsSuperOrAdmin,
  body("UserName").not().isEmpty().withMessage("UserName is required"),
  body("UserNumber").isNumeric().withMessage("UserNumber should be a number"),
  createUser
);

UserRouter.get("/user/getall", IsSuperOrAdmin, getAllUsers);

UserRouter.get("/user/getuser/:id", IsSuperOrAdmin, getUserById);

UserRouter.put(
  "/user/update/:id",
  IsSuperOrAdmin,
  body("UserName").not().isEmpty().withMessage("UserName is required"),
  body("UserNumber").isNumeric().withMessage("UserNumber should be a number"),
  updateUserById
);

UserRouter.delete("/user/delete/:id", IsSuperOrAdmin, deleteUserById);

module.exports = { UserRouter };
