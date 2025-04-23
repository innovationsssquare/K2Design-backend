const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  createACPStencilLED,
  updateACPStencilLED,
  getAllACPStencilLED,
  getSingleACPStencilLED,
  deleteACPStencilLED,
  calculateACPStencilLEDPrice,
} = require("../../../Controller/Allproductcontroller/Ledandlightboards/ACPStencilLEDController");

const ACPStencilLEDRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Product
ACPStencilLEDRouter.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  createACPStencilLED
);

// Get All Products
ACPStencilLEDRouter.get("/get", getAllACPStencilLED);

// Get Single Product
ACPStencilLEDRouter.get(
  "/get/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  getSingleACPStencilLED
);

// Update Product
ACPStencilLEDRouter.put(
  "/update/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  updateACPStencilLED
);

// Delete Product
ACPStencilLEDRouter.delete(
  "/delete/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  deleteACPStencilLED
);

// Calculate Price
ACPStencilLEDRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
  ],
  validateRequest,
  calculateACPStencilLEDPrice
);

module.exports = { ACPStencilLEDRouter };
