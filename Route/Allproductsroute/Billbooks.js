const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateBillBook,
  UpdateBillBook,
  GetAllBillBooks,
  GetSingleBillBook,
  DeleteBillBook,
  CalculateBillBookPrice,
} = require("../../Controller/Allproductcontroller/Billbooks");

const BillBookRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a bill book
BillBookRouter.post(
  "/create/BillBook",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateBillBook
);

// Route to calculate bill book price
BillBookRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("size").notEmpty().withMessage("Size is required"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculateBillBookPrice
);

// Route to update a bill book
BillBookRouter.put(
  "/update/BillBook/:id",
  [
    param("id").isMongoId().withMessage("Invalid Bill Book ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateBillBook
);

// Route to get all bill books
BillBookRouter.get("/get/BillBooks", GetAllBillBooks);

// Route to get a single bill book by ID
BillBookRouter.get(
  "/get/BillBook/:id",
  [param("id").isMongoId().withMessage("Invalid Bill Book ID")],
  validateRequest,
  GetSingleBillBook
);

// Route to delete a bill book by ID
BillBookRouter.delete(
  "/delete/BillBook/:id",
  [param("id").isMongoId().withMessage("Invalid Bill Book ID")],
  validateRequest,
  DeleteBillBook
);

module.exports = { BillBookRouter };
