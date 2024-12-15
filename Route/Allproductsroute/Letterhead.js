const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  addLetterheadProduct,
  getAllLetterheads,
  getSingleLetterhead,
  updateLetterheadProduct,
  deleteLetterheadProduct,
  calculateLetterheadPrice,
} = require("../../Controller/Allproductcontroller/Letterhead");

const LetterheadRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to add a Letterhead product
LetterheadRouter.post(
  "/add",
  [
    body("sku").notEmpty().withMessage("SKU is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
  ],
  validateRequest,
  // IsSuperAdmin,
  addLetterheadProduct
);

// Route to get all Letterhead products
LetterheadRouter.get("/all", getAllLetterheads);

// Route to get a single Letterhead product by ID
LetterheadRouter.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Letterhead ID")],
  validateRequest,
  getSingleLetterhead
);

// Route to update a Letterhead product
LetterheadRouter.put(
  "/update/:id",
  [
    param("id").isMongoId().withMessage("Invalid Letterhead ID"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("images").optional().isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  IsSuperAdmin,
  updateLetterheadProduct
);

// Route to delete a Letterhead product
LetterheadRouter.delete(
  "/delete/:id",
  [param("id").isMongoId().withMessage("Invalid Letterhead ID")],
  validateRequest,
  IsSuperAdmin,
  deleteLetterheadProduct
);

// Route to calculate Letterhead price
LetterheadRouter.post(
  "/calculate-price",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("printingType").notEmpty().withMessage("Printing type is required"),
    body("paperType").notEmpty().withMessage("Paper type is required"),
    body("quantity").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  calculateLetterheadPrice
);

module.exports = { LetterheadRouter };
