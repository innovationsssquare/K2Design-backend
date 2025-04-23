const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  createFabricFrame,
  updateFabricFrame,
  getAllFabricFrames,
  getSingleFabricFrame,
  deleteFabricFrame,
  calculateFabricFramePrice,
} = require("../../../Controller/Allproductcontroller/Ledandlightboards/FabricsTextileLED");

const FabricFramesRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Fabric Frame
FabricFramesRouter.post(
  "/create/FabricFrames",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  createFabricFrame
);

// Calculate Price
FabricFramesRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  calculateFabricFramePrice
);

// Update Product
FabricFramesRouter.put(
  "/update/FabricFrames/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  updateFabricFrame
);

// Get All Products
FabricFramesRouter.get("/get/FabricFrames", getAllFabricFrames);

// Get Single Product by ID
FabricFramesRouter.get(
  "/get/FabricFrames/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  getSingleFabricFrame
);

// Delete Product
FabricFramesRouter.delete(
  "/delete/FabricFrames/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  deleteFabricFrame
);

module.exports = { FabricFramesRouter };
