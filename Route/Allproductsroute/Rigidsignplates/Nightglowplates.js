const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateAcpPlate,
  UpdateAcpPlate,
  GetAllAcpPlates,
  GetSingleAcpPlate,
  DeleteAcpPlate,
  CalculateAcpPlatePrice,
} = require("../../../Controller/Allproductcontroller/Rigidsignplates/Nightglowplates");

const NightglowPlateRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a new ACP Plate
NightglowPlateRouter.post(
  "/create/NightglowPlate",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateAcpPlate
);

// Route to calculate price
NightglowPlateRouter.post(
  "/calculatePrice",
  [
    body("plateType").notEmpty().withMessage("Type is required"),
    body("height").isNumeric().withMessage("Height must be a number"),
    body("width").isNumeric().withMessage("Width must be a number"),
  ],
  validateRequest,
  CalculateAcpPlatePrice
);

// Route to update an ACP Plate
NightglowPlateRouter.put(
  "/update/NightglowPlate/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  UpdateAcpPlate
);

// Route to get all ACP Plates
NightglowPlateRouter.get("/get/AcpPlate", GetAllAcpPlates);

// Route to get a single ACP Plate by ID
NightglowPlateRouter.get(
  "/get/NightglowPlate/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  GetSingleAcpPlate
);

// Route to delete an ACP Plate
NightglowPlateRouter.delete(
  "/delete/NightglowPlate/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  DeleteAcpPlate
);

module.exports = { NightglowPlateRouter };
