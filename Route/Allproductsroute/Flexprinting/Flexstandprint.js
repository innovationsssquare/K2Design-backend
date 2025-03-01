const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateFlexStand,
  UpdateFlexStand,
  GetAllFlexStands,
  GetSingleFlexStand,
  DeleteFlexStand,
  CalculateFlexStandPrice,
} = require("../../../Controller/Allproductcontroller/Flexprinting/Flexstandprint");

const FlexStandRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a Flex Stand
FlexStandRouter.post(
  "/create/FlexStand",
  [
    body("name").notEmpty().withMessage("Flex Stand Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray().withMessage("Configurations must be an array"),
  ],
  validateRequest,
  CreateFlexStand
);

// Route to calculate Flex Stand price
FlexStandRouter.post(
  "/calculatePrice",
  [
    body("standType").notEmpty().withMessage("Stand Type is required"),
    body("frameSize").notEmpty().withMessage("Frame Size is required"),
    body("msTubeType").notEmpty().withMessage("MS Tube Type is required"),
    body("flexType").notEmpty().withMessage("Flex Type is required"),
    body("sideType").notEmpty().withMessage("Side Type is required"),
  ],
  validateRequest,
  CalculateFlexStandPrice
);

// Route to update a Flex Stand
FlexStandRouter.put(
  "/update/FlexStand/:id",
  [param("id").isMongoId().withMessage("Invalid Flex Stand ID")],
  validateRequest,
  UpdateFlexStand
);

// Route to get all Flex Stands
FlexStandRouter.get("/get/FlexStand", GetAllFlexStands);

// Route to get a single Flex Stand by ID
FlexStandRouter.get(
  "/get/FlexStand/:id",
  [param("id").isMongoId().withMessage("Invalid Flex Stand ID")],
  validateRequest,
  GetSingleFlexStand
);

// Route to delete a Flex Stand by ID
FlexStandRouter.delete(
  "/delete/FlexStand/:id",
  [param("id").isMongoId().withMessage("Invalid Flex Stand ID")],
  validateRequest,
  DeleteFlexStand
);

module.exports = { FlexStandRouter };
