const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateVinylLettersNumbers,
  UpdateVinylLettersNumbers,
  GetAllVinylLettersNumbers,
  GetSingleVinylLettersNumbers,
  DeleteVinylLettersNumbers,
  CalculateVinylLettersNumbersPrice,
} = require("../../../Controller/Allproductcontroller/Vinylletters/Vinylletter");

const VinylLettersNumbersRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Vinyl Letters & Numbers
VinylLettersNumbersRouter.post(
  "/create/VinylLettersNumbers",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateVinylLettersNumbers
);

// Calculate Price
VinylLettersNumbersRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  CalculateVinylLettersNumbersPrice
);

// Update Product
VinylLettersNumbersRouter.put(
  "/update/VinylLettersNumbers/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  UpdateVinylLettersNumbers
);

// Get All Products
VinylLettersNumbersRouter.get("/get/VinylLettersNumbers", GetAllVinylLettersNumbers);

// Get Single Product by ID
VinylLettersNumbersRouter.get(
  "/get/VinylLettersNumbers/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  GetSingleVinylLettersNumbers
);

// Delete Product
VinylLettersNumbersRouter.delete(
  "/delete/VinylLettersNumbers/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  DeleteVinylLettersNumbers
);

module.exports = { VinylLettersNumbersRouter };
