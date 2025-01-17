const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  CreatePavatiBook,
  UpdatePavatiBook,
  GetAllPavatiBooks,
  GetSinglePavatiBook,
  DeletePavatiBook,
  CalculatePavatiBookPrice,
} = require("../../Controller/Allproductcontroller/Pavtibook");

const PavatiBooksRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a Pavati book
PavatiBooksRouter.post(
  "/create/PavatiBook",
  [
    body("product").notEmpty().withMessage("Product name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.type")
      .notEmpty()
      .withMessage("Type is required")
      .isIn(["Multi Colour", "One Colour"])
      .withMessage("Type must be 'Multi Colour' or 'One Colour'"),
    body("configurations.*.size").notEmpty().withMessage("Size is required"),
    body("configurations.*.pages")
      .notEmpty()
      .withMessage("Pages are required")
      .isIn([50, 100])
      .withMessage("Pages must be either 50 or 100"),
    body("configurations.*.quantities").isArray({ min: 1 }).withMessage("Quantities are required"),
  ],
  validateRequest,
  CreatePavatiBook
);

// Route to calculate Pavati book price
PavatiBooksRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("size").notEmpty().withMessage("Size is required"),
    body("pages").isIn([50, 100]).withMessage("Pages must be either 50 or 100"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculatePavatiBookPrice
);

// Route to update a Pavati book
PavatiBooksRouter.put(
  "/update/PavatiBook/:id",
  [
    param("id").isMongoId().withMessage("Invalid Pavati Book ID"),
    body("product").optional().notEmpty().withMessage("Product name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
    body("configurations").optional().isArray().withMessage("Configurations must be an array"),
  ],
  validateRequest,
  IsSuperAdmin,
  UpdatePavatiBook
);

// Route to get all Pavati books
PavatiBooksRouter.get("/get/PavatiBooks", GetAllPavatiBooks);

// Route to get a single Pavati book by ID
PavatiBooksRouter.get(
  "/get/PavatiBook/:id",
  [param("id").isMongoId().withMessage("Invalid Pavati Book ID")],
  validateRequest,
  GetSinglePavatiBook
);

// Route to delete a Pavati book by ID
PavatiBooksRouter.delete(
  "/delete/PavatiBook/:id",
  [param("id").isMongoId().withMessage("Invalid Pavati Book ID")],
  validateRequest,
  IsSuperAdmin,
  DeletePavatiBook
);

module.exports = { PavatiBooksRouter };
