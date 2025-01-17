const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  CreatePaperBag,
  UpdatePaperBag,
  GetAllPaperBags,
  GetSinglePaperBag,
  DeletePaperBag,
  CalculatePaperBagPrice
} = require("../../Controller/Allproductcontroller/Paperbags");

const PaperbagsRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a paper bag
PaperbagsRouter.post(
  "/create/Paperbag",
  [
    body("name").notEmpty().withMessage("Paper Bag Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.size").notEmpty().withMessage("Size is required"),
    body("configurations.*.quantities").isArray({ min: 1 }).withMessage("Quantities are required"),
  ],
  validateRequest,
  CreatePaperBag
);

// Route to calculate paper bag price
PaperbagsRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculatePaperBagPrice
);

// Route to update a paper bag
PaperbagsRouter.put(
  "/update/Paperbag/:id",
  [
    param("id").isMongoId().withMessage("Invalid Paper Bag ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("price").optional().isNumeric().withMessage("Price must be numeric"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  IsSuperAdmin,
  UpdatePaperBag
);

// Route to get all paper bags
PaperbagsRouter.get("/get/Paperbags", GetAllPaperBags);

// Route to get a single paper bag by ID
PaperbagsRouter.get(
  "/get/Paperbag/:id",
  [param("id").isMongoId().withMessage("Invalid Paper Bag ID")],
  validateRequest,
  GetSinglePaperBag
);

// Route to delete a paper bag by ID
PaperbagsRouter.delete(
  "/delete/Paperbag/:id",
  [param("id").isMongoId().withMessage("Invalid Paper Bag ID")],
  validateRequest,
  IsSuperAdmin,
  DeletePaperBag
);

module.exports = { PaperbagsRouter };
