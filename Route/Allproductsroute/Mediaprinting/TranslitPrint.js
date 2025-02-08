const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateTranslitPrint,
  GetAllTranslitPrints,
  GetSingleTranslitPrint,
  CalculateTranslitPrintPrice,
} = require("../../../Controller/Allproductcontroller/Mediaprinting/TranslitPrint");

const TranslitPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create Translit Print
TranslitPrintRouter.post(
  "/create/TranslitPrint",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateTranslitPrint
);

// Route to calculate Translit Print price
TranslitPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be numeric"),
    body("width").isNumeric().withMessage("Width must be numeric"),
  ],
  validateRequest,
  CalculateTranslitPrintPrice
);

// Route to update Translit Print
// TranslitPrintRouter.put(
//   "/update/TranslitPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Translit Print ID")],
//   validateRequest,
//   UpdateTranslitPrint
// );

// Route to get all Translit Prints
TranslitPrintRouter.get("/get/TranslitPrints", GetAllTranslitPrints);

// Route to get a single Translit Print by ID
TranslitPrintRouter.get(
  "/get/TranslitPrint/:id",
  [param("id").isMongoId().withMessage("Invalid Translit Print ID")],
  validateRequest,
  GetSingleTranslitPrint
);

// Route to delete Translit Print by ID
// TranslitPrintRouter.delete(
//   "/delete/TranslitPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Translit Print ID")],
//   validateRequest,
//   DeleteTranslitPrint
// );

module.exports = { TranslitPrintRouter };
