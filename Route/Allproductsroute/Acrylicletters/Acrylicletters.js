const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  addAcrylicLettersNumbers,
  getAllAcrylicLettersNumbers,
  getAcrylicLettersNumbersById,
  updateAcrylicLettersNumbers,
  deleteAcrylicLettersNumbers,
  calculateAcrylicLettersNumbersPrice,
} = require("../../../Controller/Allproductcontroller/Acrylicletters/Acrylicletters");

const AcrylicLettersNumbersRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Acrylic Letters & Numbers
AcrylicLettersNumbersRouter.post(
  "/create/AcrylicLettersNumbers",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  addAcrylicLettersNumbers
);

// Calculate Price
AcrylicLettersNumbersRouter.post(
  "/calculatePrice",
  [
    body("thickness").notEmpty().withMessage("Thickness is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  calculateAcrylicLettersNumbersPrice
);

// Update Product
AcrylicLettersNumbersRouter.put(
  "/update/AcrylicLettersNumbers/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  updateAcrylicLettersNumbers
);

// Get All Products
AcrylicLettersNumbersRouter.get(
  "/get/AcrylicLettersNumbers",
  getAllAcrylicLettersNumbers
);

// Get Single Product by ID
AcrylicLettersNumbersRouter.get(
  "/get/AcrylicLettersNumbers/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  getAcrylicLettersNumbersById
);

// Delete Product
AcrylicLettersNumbersRouter.delete(
  "/delete/AcrylicLettersNumbers/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  deleteAcrylicLettersNumbers
);

module.exports = { AcrylicLettersNumbersRouter };
