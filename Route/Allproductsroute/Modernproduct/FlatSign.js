const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateFlatSign,
  UpdateFlatSign,
  GetAllFlatSigns,
  GetSingleFlatSign,
  DeleteFlatSign,
  CalculateFlatSignPrice,
} = require("../../../Controller/Allproductcontroller/Modernproduct/FlatSign");

const FlatSignRouter = express.Router();

// Middleware for validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Flat Sign
FlatSignRouter.post(
  "/create/FlatSign",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateFlatSign
);

// Calculate Price
FlatSignRouter.post(
  "/calculatePrice",
  [
    body("mainType").notEmpty().withMessage("MainType is required"),
    body("widthMM").isNumeric().withMessage("Width must be a number"),
    body("heightMM").isNumeric().withMessage("Height must be a number"),
  ],
  validateRequest,
  CalculateFlatSignPrice
);

// Update
FlatSignRouter.put(
  "/update/FlatSign/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  UpdateFlatSign
);

// Get All
FlatSignRouter.get("/get/FlatSign", GetAllFlatSigns);

// Get Single
FlatSignRouter.get(
  "/get/FlatSign/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  GetSingleFlatSign
);

// Delete
FlatSignRouter.delete(
  "/delete/FlatSign/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  DeleteFlatSign
);

module.exports = { FlatSignRouter };
