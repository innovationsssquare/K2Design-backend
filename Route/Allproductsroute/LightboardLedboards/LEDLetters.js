const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  createLEDLetter,
  updateLEDLetter,
  getAllLEDLetters,
  getSingleLEDLetter,
  deleteLEDLetter,
  calculateLEDLetterPrice,
} = require("../../../Controller/Allproductcontroller/Ledandlightboards/LEDLetters");

const ledLettersRouter = express.Router();

// Middleware for validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create 3D LED Letter Product
ledLettersRouter.post(
  "/create/ledLetter",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  createLEDLetter
);

// Calculate Price
ledLettersRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
  ],
  validateRequest,
  calculateLEDLetterPrice
);

// Update LED Letters Product
ledLettersRouter.put(
  "/update/ledLetter/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  updateLEDLetter
);

// Get All LED Letters
ledLettersRouter.get("/get/ledLetters", getAllLEDLetters);

// Get Single LED Letter Product
ledLettersRouter.get(
  "/get/ledLetter/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  getSingleLEDLetter
);

// Delete LED Letter Product
ledLettersRouter.delete(
  "/delete/ledLetter/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  deleteLEDLetter
);

module.exports = { ledLettersRouter };
