const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateFlexBannerPrint,
  UpdateFlexBannerPrint,
  GetAllFlexBannerPrints,
  GetSingleFlexBannerPrint,
  DeleteFlexBannerPrint,
  CalculateFlexBannerPrintPrice,
} = require("../../../Controller/Allproductcontroller/Flexprinting/Flexbannereconomy");

const FlexBannerecoPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a Flex Banner Print
FlexBannerecoPrintRouter.post(
  "/create/FlexBannerPrint",
  [
    body("name").notEmpty().withMessage("Product Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateFlexBannerPrint
);

// Route to calculate price
FlexBannerecoPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be numeric"),
    body("width").isNumeric().withMessage("Width must be numeric"),
  ],
  validateRequest,
  CalculateFlexBannerPrintPrice
);

// Route to update a Flex Banner Print
FlexBannerecoPrintRouter.put(
  "/update/FlexBannerPrint/:id",
  [
    param("id").isMongoId().withMessage("Invalid ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateFlexBannerPrint
);

// Route to get all Flex Banner Prints
FlexBannerecoPrintRouter.get("/get/FlexBannerPrints", GetAllFlexBannerPrints);

// Route to get a single Flex Banner Print by ID
FlexBannerecoPrintRouter.get(
  "/get/FlexBannerPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  GetSingleFlexBannerPrint
);

// Route to delete a Flex Banner Print by ID
FlexBannerecoPrintRouter.delete(
  "/delete/FlexBannerPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  DeleteFlexBannerPrint
);

module.exports = { FlexBannerecoPrintRouter };
