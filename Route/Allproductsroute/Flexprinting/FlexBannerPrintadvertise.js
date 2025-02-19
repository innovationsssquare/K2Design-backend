const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateFlexBannerPrint,
  UpdateFlexBannerPrint,
  GetAllFlexBannerPrints,
  GetSingleFlexBannerPrint,
  DeleteFlexBannerPrint,
  CalculateFlexBannerPrintPrice,
} = require("../../../Controller/Allproductcontroller/Flexprinting/FlexBannerPrintadvertise");

const FlexBannerPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a flex banner print
FlexBannerPrintRouter.post(
  "/create/FlexBannerPrint",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateFlexBannerPrint
);

// Route to calculate flex banner print price
FlexBannerPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be numeric"),
    body("width").isNumeric().withMessage("Width must be numeric"),
  ],
  validateRequest,
  CalculateFlexBannerPrintPrice
);

// Route to update a flex banner print
FlexBannerPrintRouter.put(
  "/update/FlexBannerPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  UpdateFlexBannerPrint
);

// Route to get all flex banner prints
FlexBannerPrintRouter.get("/get/FlexBannerPrint", GetAllFlexBannerPrints);

// Route to get a single flex banner print by ID
FlexBannerPrintRouter.get(
  "/get/FlexBannerPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  GetSingleFlexBannerPrint
);

// Route to delete a flex banner print by ID
FlexBannerPrintRouter.delete(
  "/delete/FlexBannerPrint/:id",
  [param("id").isMongoId().withMessage("Invalid ID")],
  validateRequest,
  DeleteFlexBannerPrint
);

module.exports = { FlexBannerPrintRouter };
