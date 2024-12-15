const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  addEnvelopeProduct,
  getAllEnvelopes,
  getSingleEnvelope,
  updateEnvelopeProduct,
  deleteEnvelopeProduct,
  calculateEnvelopePrice,
} = require("../../Controller/Allproductcontroller/Envolopes");

const EnvelopeRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to add an envelope product
EnvelopeRouter.post(
  "/add",
  [
    body("sku").notEmpty().withMessage("SKU is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.size")
      .notEmpty()
      .withMessage("Size is required")
      .isIn(["9x4", "7x5", "6x9", "A4","6x4"])
      .withMessage("Invalid size"),
    body("configurations.*.printingType")
      .notEmpty()
      .withMessage("Printing type is required")
      .isIn(["Multicolour", "One Colour"])
      .withMessage("Invalid printing type"),
    body("configurations.*.paperType")
      .notEmpty()
      .withMessage("Paper type is required")
      .isIn(["100gsm Bond/Sunshine", "130gsm Art Paper", "70gsm Maplitho"])
      .withMessage("Invalid paper type"),
    body("configurations.*.quantityOptions")
      .isArray({ min: 1 })
      .withMessage("Quantity options are required"),
  ],
  validateRequest,
  // IsSuperAdmin,
  addEnvelopeProduct
);

// Route to get all envelope products
EnvelopeRouter.get("/all", getAllEnvelopes);

// Route to get a single envelope product by ID
EnvelopeRouter.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Envelope ID")],
  validateRequest,
  getSingleEnvelope
);

// Route to update an envelope product
EnvelopeRouter.put(
  "/update/:id",
  [
    param("id").isMongoId().withMessage("Invalid Envelope ID"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("images").optional().isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  IsSuperAdmin,
  updateEnvelopeProduct
);

// Route to delete an envelope product
EnvelopeRouter.delete(
  "/delete/:id",
  [param("id").isMongoId().withMessage("Invalid Envelope ID")],
  validateRequest,
  IsSuperAdmin,
  deleteEnvelopeProduct
);

// Route to calculate envelope price
EnvelopeRouter.post(
  "/calculate-price",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("printingType").notEmpty().withMessage("Printing type is required"),
    body("paperType").notEmpty().withMessage("Paper type is required"),
    body("quantity").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  calculateEnvelopePrice
);

module.exports = { EnvelopeRouter };
