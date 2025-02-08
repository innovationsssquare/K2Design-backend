const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { 
  CreateNightGlowPrint, 
  UpdateNightGlowPrint, 
  GetAllNightGlowPrints, 
  GetSingleNightGlowPrint, 
  DeleteNightGlowPrint, 
  CalculateNightGlowPrintPrice 
} = require("../../../Controller/Allproductcontroller/Mediaprinting/Nightglow");

const NightGlowPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a Night Glow Print
NightGlowPrintRouter.post(
  "/create/NightGlowPrint",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateNightGlowPrint
);

// Route to calculate price
NightGlowPrintRouter.post(
  "/calculatePrice",
  [
    body("rigidSurface").notEmpty().withMessage("Rigid Surface is required"),
    body("width").isNumeric().withMessage("Width must be a numeric value"),
    body("height").isNumeric().withMessage("Height must be a numeric value"),
    body("lamination").optional().isBoolean().withMessage("Lamination must be boolean"),
  ],
  validateRequest,
  CalculateNightGlowPrintPrice
);

// Route to update
NightGlowPrintRouter.put(
  "/update/NightGlowPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  UpdateNightGlowPrint
);

// Route to get all Night Glow Prints
NightGlowPrintRouter.get("/get/NightGlowPrints", GetAllNightGlowPrints);

// Route to get a single Night Glow Print by ID
NightGlowPrintRouter.get(
  "/get/NightGlowPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  GetSingleNightGlowPrint
);

// Route to delete
NightGlowPrintRouter.delete(
  "/delete/NightGlowPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  DeleteNightGlowPrint
);

module.exports = { NightGlowPrintRouter };
