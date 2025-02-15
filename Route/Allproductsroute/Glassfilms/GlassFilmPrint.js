const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateGlassFilmPrint,
  CalculateGlassFilmPrintPrice,
  GetAllGlassFilmPrints,
  GetSingleGlassFilmPrint,
} = require("../../../Controller/Allproductcontroller/Glassfilms/GlassFilmPrint");

const GlassFilmPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Glass Film Print
GlassFilmPrintRouter.post(
  "/create/GlassFilmPrint",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations")
      .isArray({ min: 1 })
      .withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateGlassFilmPrint
);

// Calculate Glass Film Print Price
GlassFilmPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be numeric"),
    body("width").isNumeric().withMessage("Width must be numeric"),
  ],
  validateRequest,
  CalculateGlassFilmPrintPrice
);

// Update Glass Film Print
// GlassFilmPrintRouter.put(
//   "/update/GlassFilmPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Glass Film Print ID")],
//   validateRequest,
//   UpdateGlassFilmPrint
// );

// Get All Glass Film Prints
GlassFilmPrintRouter.get("/get/GlassFilmPrints", GetAllGlassFilmPrints);

// Get Single Glass Film Print by ID
GlassFilmPrintRouter.get(
  "/get/GlassFilmPrint/:id",
  [param("id").isMongoId().withMessage("Invalid Glass Film Print ID")],
  validateRequest,
  GetSingleGlassFilmPrint
);

// // Delete Glass Film Print
// GlassFilmPrintRouter.delete(
//   "/delete/GlassFilmPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Glass Film Print ID")],
//   validateRequest,
//   DeleteGlassFilmPrint
// );

module.exports = { GlassFilmPrintRouter };
