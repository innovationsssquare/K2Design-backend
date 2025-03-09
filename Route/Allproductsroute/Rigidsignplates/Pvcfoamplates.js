const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateAcpPlate,
  UpdateAcpPlate,
  GetAllAcpPlates,
  GetSingleAcpPlate,
  DeleteAcpPlate,
  CalculateAcpPlatePrice,
} = require("../../../Controller/Allproductcontroller/Rigidsignplates/Pvcfoamplates");

const PvcfoamPlateRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a new ACP Plate
PvcfoamPlateRouter.post(
  "/create/PvcfoamPlate",
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
PvcfoamPlateRouter.post(
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
PvcfoamPlateRouter.put(
  "/update/PvcfoamPlate/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  UpdateAcpPlate
);

// Route to get all ACP Plates
PvcfoamPlateRouter.get("/get/PvcfoamPlate", GetAllAcpPlates);

// Route to get a single ACP Plate by ID
PvcfoamPlateRouter.get(
  "/get/PvcfoamPlate/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  GetSingleAcpPlate
);

// Route to delete an ACP Plate
PvcfoamPlateRouter.delete(
  "/delete/PvcfoamPlate/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  DeleteAcpPlate
);

module.exports = { PvcfoamPlateRouter };
