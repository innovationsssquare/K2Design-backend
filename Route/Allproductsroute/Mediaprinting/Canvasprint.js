const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { 
    CreateCanvasPrint,
    CalculateCanvasPrintPrice,
    GetAllCanvasPrints,
    GetSingleCanvasPrint,
    DeleteCanvasPrint,
} = require("../../../Controller/Allproductcontroller/Mediaprinting/Canvasprint");

const CanvasPrintRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a canvas print
CanvasPrintRouter.post(
  "/create/CanvasPrint",
  [
    body("name").notEmpty().withMessage("Canvas Print Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations").isArray({ min: 1 }).withMessage("Configurations are required"),
    body("configurations.*.type").notEmpty().withMessage("Type is required"),
  ],
  validateRequest,
  CreateCanvasPrint
);

// Route to calculate canvas print price
CanvasPrintRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be numeric"),
    body("width").isNumeric().withMessage("Width must be numeric"),
  ],
  validateRequest,
  CalculateCanvasPrintPrice
);

// Route to update a canvas print
// CanvasPrintRouter.put(
//   "/update/CanvasPrint/:id",
//   [
//     param("id").isMongoId().withMessage("Invalid Canvas Print ID"),
//   ],
//   validateRequest,
//   UpdateCanvasPrint
// );

// Route to get all canvas prints
CanvasPrintRouter.get("/get/CanvasPrints", GetAllCanvasPrints);

// Route to get a single canvas print by ID
CanvasPrintRouter.get(
  "/get/CanvasPrint/:id",
  [param("id").isMongoId().withMessage("Invalid Canvas Print ID")],
  validateRequest,
  GetSingleCanvasPrint
);

// Route to delete a canvas print by ID
CanvasPrintRouter.delete(
  "/delete/CanvasPrint/:id",
  [param("id").isMongoId().withMessage("Invalid Canvas Print ID")],
  validateRequest,
  DeleteCanvasPrint
);

module.exports = { CanvasPrintRouter };
