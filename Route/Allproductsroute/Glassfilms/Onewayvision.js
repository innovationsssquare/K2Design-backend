const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateOneWayVision,
  UpdateOneWayVision,
  GetAllOneWayVisions,
  GetSingleOneWayVision,
  CalculateOneWayVisionPrice,
} = require("../../../Controller/Allproductcontroller/Glassfilms/Onwwayvision");

const OneWayVisionRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create One Way Vision Print
OneWayVisionRouter.post(
  "/create/OneWayVision",
  [
    body("name").notEmpty().withMessage("Product Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateOneWayVision
);

// Calculate One Way Vision Print Price
OneWayVisionRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  CalculateOneWayVisionPrice
);

// Get All One Way Vision Prints
OneWayVisionRouter.get("/get/OneWayVisions", GetAllOneWayVisions);

// Get Single One Way Vision Print by ID
OneWayVisionRouter.get(
  "/get/OneWayVision/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  GetSingleOneWayVision
);

// Update One Way Vision Print
OneWayVisionRouter.put(
  "/update/OneWayVision/:id",
  [
    param("id").isMongoId().withMessage("Invalid Product ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateOneWayVision
);

// // Delete One Way Vision Print
// OneWayVisionRouter.delete(
//   "/delete/OneWayVision/:id",
//   [param("id").isMongoId().withMessage("Invalid Product ID")],
//   validateRequest,
//   DeleteOneWayVision
// );

module.exports = { OneWayVisionRouter };
