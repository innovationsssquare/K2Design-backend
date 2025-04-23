const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  createBacklitFlexBoard,
  updateBacklitFlexBoard,
  getAllBacklitFlexBoards,
  getSingleBacklitFlexBoard,
  deleteBacklitFlexBoard,
  calculateBacklitFlexBoardPrice,
} = require("../../../Controller/Allproductcontroller/Ledandlightboards/backlitFlexBoard");

const backlitFlexBoardRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Backlit Flex Board Product
backlitFlexBoardRouter.post(
  "/create",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  createBacklitFlexBoard
);

// Calculate Price
backlitFlexBoardRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  calculateBacklitFlexBoardPrice
);

// Update Product
backlitFlexBoardRouter.put(
  "/update/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  updateBacklitFlexBoard
);

// Get All Products
backlitFlexBoardRouter.get("/get", getAllBacklitFlexBoards);

// Get Single Product by ID
backlitFlexBoardRouter.get(
  "/get/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  getSingleBacklitFlexBoard
);

// Delete Product
backlitFlexBoardRouter.delete(
  "/delete/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  deleteBacklitFlexBoard
);

module.exports = { backlitFlexBoardRouter };
