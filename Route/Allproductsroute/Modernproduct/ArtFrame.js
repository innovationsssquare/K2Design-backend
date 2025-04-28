const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateArtFrame,
  UpdateArtFrame,
  GetAllArtFrames,
  GetSingleArtFrame,
  DeleteArtFrame,
  CalculateArtFramePrice,
} = require("../../../Controller/Allproductcontroller/Modernproduct/ArtFrame");

const ArtFrameRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Art Frame
ArtFrameRouter.post(
  "/create/ArtFrame",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateArtFrame
);

// Calculate Price
ArtFrameRouter.post(
  "/calculatePrice",
  [
    body("mainType").notEmpty().withMessage("Main type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  CalculateArtFramePrice
);

// Update Product
ArtFrameRouter.put(
  "/update/ArtFrame/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  UpdateArtFrame
);

// Get All Products
ArtFrameRouter.get("/get/ArtFrame", GetAllArtFrames);

// Get Single Product by ID
ArtFrameRouter.get(
  "/get/ArtFrame/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  GetSingleArtFrame
);

// Delete Product
ArtFrameRouter.delete(
  "/delete/ArtFrame/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  DeleteArtFrame
);

module.exports = { ArtFrameRouter };
