const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateRollUpStandee,
  UpdateRollUpStandee,
  GetAllRollUpStandees,
  GetSingleRollUpStandee,
  DeleteRollUpStandee,
  CalculateRollUpStandeePrice

} = require("../../../Controller/Allproductcontroller/Flexprinting/Flexrollupstand");

const RollUpStandeeRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a Roll Up Standee
RollUpStandeeRouter.post(
  "/create/RollUpStandee",
  [
    body("name").notEmpty().withMessage("Standee Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray().withMessage("Configurations are required"),
  ],
  validateRequest,
  CreateRollUpStandee
);

// Route to update a Roll Up Standee
RollUpStandeeRouter.put(
  "/update/RollUpStandee/:id",
  [param("id").isMongoId().withMessage("Invalid Standee ID")],
  validateRequest,
  UpdateRollUpStandee
);

// Route to get all Roll Up Standees
RollUpStandeeRouter.get("/get/RollUpStandees", GetAllRollUpStandees);

// Route to get a single Roll Up Standee by ID
RollUpStandeeRouter.get(
  "/get/RollUpStandee/:id",
  [param("id").isMongoId().withMessage("Invalid Standee ID")],
  validateRequest,
  GetSingleRollUpStandee
);

// Route to delete a Roll Up Standee by ID
RollUpStandeeRouter.delete(
  "/delete/RollUpStandee/:id",
  [param("id").isMongoId().withMessage("Invalid Standee ID")],
  validateRequest,
  DeleteRollUpStandee
);

RollUpStandeeRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("quantity").isNumeric().withMessage("Quantity must be a number"),
  ],
  validateRequest,
  CalculateRollUpStandeePrice
);

module.exports = { RollUpStandeeRouter };
