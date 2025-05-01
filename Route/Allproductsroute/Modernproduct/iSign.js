const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateISignWallMounted,
  UpdateISignWallMounted,
  GetAllISignWallMounted,
  GetSingleISignWallMounted,
  DeleteISignWallMounted,
  CalculateISignWallMountedPrice,
} = require("../../../Controller/Allproductcontroller/Modernproduct/iSign");

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/create/ISignWallMounted",
  [
    body("name").notEmpty(),
    body("categoryId").notEmpty(),
    body("sku").notEmpty(),
    body("images").isArray(),
  ],
  validateRequest,
  CreateISignWallMounted
);

router.post(
  "/calculatePrice",
  [
    body("type").notEmpty(),
    body("height").isNumeric(),
    body("width").isNumeric(),
  ],
  validateRequest,
  CalculateISignWallMountedPrice
);

router.put(
  "/update/ISignWallMounted/:id",
  [param("id").isMongoId()],
  validateRequest,
  UpdateISignWallMounted
);

router.get("/get/ISignWallMounted", GetAllISignWallMounted);
router.get("/get/ISignWallMounted/:id", [param("id").isMongoId()], GetSingleISignWallMounted);
router.delete("/delete/ISignWallMounted/:id", [param("id").isMongoId()], DeleteISignWallMounted);

module.exports = { ISignWallMountedRouter: router };
