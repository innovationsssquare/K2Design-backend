const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateBacklitFlexPrint,
  GetAllBacklitFlexPrints,
  GetSingleBacklitFlexPrint,
  DeleteBacklitFlexPrint,
  CalculateBacklitFlexPrintPrice,
} = require("../../../Controller/Allproductcontroller/Mediaprinting/Backlitflexprint");

const BacklitFlexPrintRouter = express.Router();

// Middleware to handle validation errorsBacklitFlexPrintRouter
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a Backlit Flex Print
BacklitFlexPrintRouter.post(
  "/create/BacklitFlexPrint",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  CreateBacklitFlexPrint
);

// Route to calculate Backlit Flex Print price
BacklitFlexPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be numeric"),
    body("width").isNumeric().withMessage("Width must be numeric"),
  ],
  validateRequest,
  CalculateBacklitFlexPrintPrice
);

// Route to update a Backlit Flex Print
// BacklitFlexPrintRouter.put(
//   "/update/BacklitFlexPrint/:id",
//   [param("id").isMongoId().withMessage("Invalid Backlit Flex Print ID")],
//   validateRequest,
//   UpdateBacklitFlexPrint
// );

// Route to get all Backlit Flex Prints
BacklitFlexPrintRouter.get("/get/BacklitFlexPrints", GetAllBacklitFlexPrints);

// Route to get a single Backlit Flex Print by ID
BacklitFlexPrintRouter.get(
  "/get/BacklitFlexPrint/:id",
  [param("id").isMongoId().withMessage("Invalid Backlit Flex Print ID")],
  validateRequest,
  GetSingleBacklitFlexPrint
);

// Route to delete a Backlit Flex Print by ID
BacklitFlexPrintRouter.delete(
  "/delete/BacklitFlexPrint/:id",
  [param("id").isMongoId().withMessage("Invalid Backlit Flex Print ID")],
  validateRequest,
  DeleteBacklitFlexPrint
);

module.exports = { BacklitFlexPrintRouter };
