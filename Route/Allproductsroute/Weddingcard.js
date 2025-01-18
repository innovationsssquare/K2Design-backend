const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateWeddingCard,
  UpdateWeddingCard,
  GetAllWeddingCards,
  GetSingleWeddingCard,
  DeleteWeddingCard,
  CalculateWeddingCardPrice,
} = require("../../Controller/Allproductcontroller/Weddingcard");

const WeddingCardRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a wedding card
WeddingCardRouter.post(
  "/create/WeddingCard",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.size").notEmpty().withMessage("Size is required"),
    body("configurations.*.paperType").notEmpty().withMessage("Paper Type is required"),
    body("configurations.*.quantities").isArray({ min: 1 }).withMessage("Quantities are required"),
  ],
  validateRequest,
  CreateWeddingCard
);

// Route to calculate wedding card price
WeddingCardRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("paperType").notEmpty().withMessage("Paper Type is required"),
    body("sides").isIn([1, 2]).withMessage("Sides must be 1 or 2"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculateWeddingCardPrice
);

// Route to update a wedding card
WeddingCardRouter.put(
  "/update/WeddingCard/:id",
  [
    param("id").isMongoId().withMessage("Invalid Wedding Card ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateWeddingCard
);

// Route to get all wedding cards
WeddingCardRouter.get("/get/WeddingCards", GetAllWeddingCards);

// Route to get a single wedding card by ID
WeddingCardRouter.get(
  "/get/WeddingCard/:id",
  [param("id").isMongoId().withMessage("Invalid Wedding Card ID")],
  validateRequest,
  GetSingleWeddingCard
);

// Route to delete a wedding card by ID
WeddingCardRouter.delete(
  "/delete/WeddingCard/:id",
  [param("id").isMongoId().withMessage("Invalid Wedding Card ID")],
  validateRequest,
  DeleteWeddingCard
);

module.exports = { WeddingCardRouter };
