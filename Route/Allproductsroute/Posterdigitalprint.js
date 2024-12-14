const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreatePrintProduct,
  UpdatePrintProduct,
  GetAllPrintProducts,
  GetSinglePrintProduct,
  DeletePrintProduct,
  CalculatePrintProductPrice,
} = require("../../Controller/Allproductcontroller/Posterdigitalprint");

const PrintProductRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a new print product
PrintProductRouter.post(
  "/create/PrintProduct",
  [
    body("name").notEmpty().withMessage("Product Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray().withMessage("Configurations must be an array"),
  ],
  validateRequest,
  CreatePrintProduct
);

// Route to calculate the print product price
PrintProductRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("printingSide").notEmpty().withMessage("Printing Side is required"),
    body("paperType").notEmpty().withMessage("Paper Type is required"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculatePrintProductPrice
);

// Route to update a print product
PrintProductRouter.put(
  "/update/PrintProduct/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  UpdatePrintProduct
);

// Route to get all print products

// Route to get a single print product by ID
PrintProductRouter.get(
  "/get/PrintProduct/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  GetSinglePrintProduct
);
PrintProductRouter.get(
  "/getAll/PrintProduct",
  validateRequest,
  GetAllPrintProducts
);

// Route to delete a print product by ID
PrintProductRouter.delete(
  "/delete/PrintProduct/:id",
  [param("id").isMongoId().withMessage("Invalid Product ID")],
  validateRequest,
  DeletePrintProduct
);

module.exports = { PrintProductRouter };
