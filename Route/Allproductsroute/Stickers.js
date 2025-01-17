const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  CreateStickerLabel,
  UpdateStickerLabel,
  GetAllStickerLabels,
  GetSingleStickerLabel,
  DeleteStickerLabel,
  CalculateStickerLabelPrice,
} = require("../../Controller/Allproductcontroller/Stickers");

const StickerLabelsRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a sticker/label
StickerLabelsRouter.post(
  "/create/StickerLabel",
  [
    body("name").notEmpty().withMessage("Sticker/Label Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.size").notEmpty().withMessage("Size is required"),
    body("configurations.*.quantities").isArray({ min: 1 }).withMessage("Quantities are required"),
    body("customizations").optional().isArray().withMessage("Customizations must be an array"),
  ],
  validateRequest,
  CreateStickerLabel
);

// Route to calculate sticker/label price
StickerLabelsRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculateStickerLabelPrice
);

// Route to update a sticker/label
StickerLabelsRouter.put(
  "/update/StickerLabel/:id",
  [
    param("id").isMongoId().withMessage("Invalid Sticker/Label ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
    body("configurations").optional().isArray().withMessage("Configurations must be an array"),
    body("customizations").optional().isArray().withMessage("Customizations must be an array"),
  ],
  validateRequest,
  IsSuperAdmin,
  UpdateStickerLabel
);

// Route to get all stickers/labels
StickerLabelsRouter.get("/get/StickerLabels", GetAllStickerLabels);

// Route to get a single sticker/label by ID
StickerLabelsRouter.get(
  "/get/StickerLabel/:id",
  [param("id").isMongoId().withMessage("Invalid Sticker/Label ID")],
  validateRequest,
  GetSingleStickerLabel
);

// Route to delete a sticker/label by ID
StickerLabelsRouter.delete(
  "/delete/StickerLabel/:id",
  [param("id").isMongoId().withMessage("Invalid Sticker/Label ID")],
  validateRequest,
  IsSuperAdmin,
  DeleteStickerLabel
);

module.exports = { StickerLabelsRouter };
