const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateFlexBannerWoodenFrame,
  UpdateFlexBannerWoodenFrame,
  GetAllFlexBannerWoodenFrames,
  GetSingleFlexBannerWoodenFrame,
  DeleteFlexBannerWoodenFrame,
  CalculateFlexBannerWoodenFramePrice,
} = require("../../../Controller/Allproductcontroller/Flexprinting/Flexbannerwood");

const FlexBannerWoodenFrameRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// **Route to create a Flex Banner with Wooden Frame**
FlexBannerWoodenFrameRouter.post(
  "/create/FlexBannerWoodenFrame",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateFlexBannerWoodenFrame
);

// **Route to calculate Flex Banner price**
FlexBannerWoodenFrameRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
   
  ],
  validateRequest,
  CalculateFlexBannerWoodenFramePrice
);

// **Route to update Flex Banner**
FlexBannerWoodenFrameRouter.put(
  "/update/FlexBannerWoodenFrame/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  UpdateFlexBannerWoodenFrame
);

// **Route to get all Flex Banners**
FlexBannerWoodenFrameRouter.get("/get/FlexBannerWoodenFrames", GetAllFlexBannerWoodenFrames);

// **Route to get a single Flex Banner**
FlexBannerWoodenFrameRouter.get(
  "/get/FlexBannerWoodenFrame/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  GetSingleFlexBannerWoodenFrame
);

// **Route to delete a Flex Banner**
FlexBannerWoodenFrameRouter.delete(
  "/delete/FlexBannerWoodenFrame/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  DeleteFlexBannerWoodenFrame
);

module.exports = { FlexBannerWoodenFrameRouter };
