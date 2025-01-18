const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateStamp,
  UpdateStamp,
  GetAllStamps,
  GetSingleStamp,
  DeleteStamp,
  CalculateStampPrice,
} = require("../../Controller/Allproductcontroller/Stamps");

const StampRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a stamp
StampRouter.post(
  "/create/Stamp",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.type").notEmpty().withMessage("Type is required"),
    body("configurations.*.Stampname").notEmpty().withMessage("Stampname is required"),
  ],
  validateRequest,
  CreateStamp
);

// Route to calculate stamp price
StampRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("Stampname").notEmpty().withMessage("Stampname is required"),
    body("lines").optional().isNumeric().withMessage("Lines must be numeric"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculateStampPrice
);

// Route to update a stamp
StampRouter.put(
  "/update/Stamp/:id",
  [
    param("id").isMongoId().withMessage("Invalid Stamp ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateStamp
);

// Route to get all stamps
StampRouter.get("/get/Stamps", GetAllStamps);

// Route to get a single stamp by ID
StampRouter.get(
  "/get/Stamp/:id",
  [param("id").isMongoId().withMessage("Invalid Stamp ID")],
  validateRequest,
  GetSingleStamp
);

// Route to delete a stamp by ID
StampRouter.delete(
  "/delete/Stamp/:id",
  [param("id").isMongoId().withMessage("Invalid Stamp ID")],
  validateRequest,
  DeleteStamp
);

module.exports = { StampRouter };
