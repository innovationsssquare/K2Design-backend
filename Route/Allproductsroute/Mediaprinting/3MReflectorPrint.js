const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateThreeMReflectorPrint,
//   UpdateThreeMReflectorPrint,
//   GetAllThreeMReflectorPrints,
//   GetSingleThreeMReflectorPrint,
//   DeleteThreeMReflectorPrint,
  CalculateThreeMReflectorPrintPrice,
} = require("../../../Controller/Allproductcontroller/Mediaprinting/3MReflectorPrint");

const ThreeMReflectorPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create 3M Reflector Print
ThreeMReflectorPrintRouter.post(
  "/create/ThreeMReflectorPrint",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateThreeMReflectorPrint
);

// Calculate Price
ThreeMReflectorPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Product type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  CalculateThreeMReflectorPrintPrice
);

// Update Product
// ThreeMReflectorPrintRouter.put(
//   "/update/ThreeMReflectorPrint/:id",
//   [
//     param("id").isMongoId().withMessage("Invalid Product ID"),
//   ],
//   validateRequest,
//   UpdateThreeMReflectorPrint
// );

// Get All Products
// ThreeMReflectorPrintRouter.get("/get/ThreeMReflectorPrint", GetAllThreeMReflectorPrints);

// // Get Single Product by ID
// ThreeMReflectorPrintRouter.get(
//   "/get/ThreeMReflectorPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Product ID")],
//   validateRequest,
//   GetSingleThreeMReflectorPrint
// );

// Delete Product
// ThreeMReflectorPrintRouter.delete(
//   "/delete/ThreeMReflectorPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Product ID")],
//   validateRequest,
//   DeleteThreeMReflectorPrint
// );

module.exports = { ThreeMReflectorPrintRouter };
