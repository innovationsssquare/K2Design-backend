const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateInvitationCard,
  UpdateInvitationCard,
  GetAllInvitationCards,
  GetSingleInvitationCard,
  DeleteInvitationCard,
  CalculateInvitationCardPrice,
} = require("../../Controller/Allproductcontroller/Invitation");

const InvitationCardRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create an invitation card
InvitationCardRouter.post(
  "/create/InvitationCard",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateInvitationCard
);

// Route to calculate invitation card price
InvitationCardRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculateInvitationCardPrice
);

// Route to update an invitation card
InvitationCardRouter.put(
  "/update/InvitationCard/:id",
  [
    param("id").isMongoId().withMessage("Invalid Invitation Card ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateInvitationCard
);

// Route to get all invitation cards
InvitationCardRouter.get("/get/InvitationCards", GetAllInvitationCards);

// Route to get a single invitation card by ID
InvitationCardRouter.get(
  "/get/InvitationCard/:id",
  [param("id").isMongoId().withMessage("Invalid Invitation Card ID")],
  validateRequest,
  GetSingleInvitationCard
);

// Route to delete an invitation card by ID
InvitationCardRouter.delete(
  "/delete/InvitationCard/:id",
  [param("id").isMongoId().withMessage("Invalid Invitation Card ID")],
  validateRequest,
  DeleteInvitationCard
);

module.exports = { InvitationCardRouter };
