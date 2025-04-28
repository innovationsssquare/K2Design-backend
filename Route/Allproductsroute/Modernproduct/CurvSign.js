const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateCurvSign,
  UpdateCurvSign,
  GetAllCurvSigns,
  GetSingleCurvSign,
  DeleteCurvSign,
  CalculateCurvSignPrice,
} = require("../../../Controller/Allproductcontroller/Modernproduct/CurvSign");

const CurvSignRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Curv Sign
CurvSignRouter.post(
  "/create/CurvSign",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateCurvSign
);

// Calculate Price
CurvSignRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Main Type is required"),
    body("widthMM").isNumeric().withMessage("Width must be a number"),
    body("heightMM").isNumeric().withMessage("Height must be a number"),
  ],
  validateRequest,
  CalculateCurvSignPrice
);

// Update Curv Sign
CurvSignRouter.put(
  "/update/CurvSign/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  UpdateCurvSign
);

// Get All Curv Signs
CurvSignRouter.get("/get/CurvSign", GetAllCurvSigns);

// Get Single Curv Sign
CurvSignRouter.get(
  "/get/CurvSign/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  GetSingleCurvSign
);

// Delete Curv Sign
CurvSignRouter.delete(
  "/delete/CurvSign/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  DeleteCurvSign
);

module.exports = { CurvSignRouter };
