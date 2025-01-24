const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  CreateVisitingCard,
  UpdateVisitingCard,
  GetAllVisitingCards,
  GetSingleVisitingCard,
  DeleteVisitingCard,
  CalculateVisitingCardPrice,
} = require("../../Controller/Allproductcontroller/Visitingcard");

const VisitingCardRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a visiting card
VisitingCardRouter.post(
  "/create/VisitingCard",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("price").isNumeric().withMessage("Price must be a numeric value"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations")
      .isArray()
      .withMessage("Configurations must be an array"),
  ],
  validateRequest,
  // IsSuperAdmin,
  CreateVisitingCard
);

// Route to calculate visiting card price
VisitingCardRouter.post(
  "/calculatePrice",
  [
    body("material").notEmpty().withMessage("Material is required"),
    body("qty")
      .isNumeric()
      .withMessage("Quantity is required and must be numeric"),
  ],
  validateRequest,
  CalculateVisitingCardPrice
);

// Route to update a visiting card
VisitingCardRouter.put(
  "/update/VisitingCard/:id",
  [param("id").isMongoId().withMessage("Invalid Visiting Card ID")],
  validateRequest,
  IsSuperAdmin,
  UpdateVisitingCard
);

// Route to get all visiting cards
VisitingCardRouter.get("/get/VisitingCard", GetAllVisitingCards);

// Route to get a single visiting card by ID
VisitingCardRouter.get(
  "/get/VisitingCard/:id",
  [param("id").isMongoId().withMessage("Invalid Visiting Card ID")],
  validateRequest,
  GetSingleVisitingCard
);

// Route to delete a visiting card by ID
VisitingCardRouter.delete(
  "/delete/VisitingCard/:id",
  [param("id").isMongoId().withMessage("Invalid Visiting Card ID")],
  validateRequest,
  DeleteVisitingCard
);

module.exports = { VisitingCardRouter };
