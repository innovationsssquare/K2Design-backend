const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateTableStand,
  UpdateTableStand,
  GetAllTableStand,
  GetSingleTableStand,
  DeleteTableStand,
  CalculateTableStandPrice
} = require("../../../Controller/Allproductcontroller/Modernproduct/TableStand");

const TableStandRouter = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

TableStandRouter.post(
  "/create/TableStand",
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("sku").notEmpty().withMessage("SKU is required"),
    body("images").isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  CreateTableStand
);

TableStandRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty(),
    body("widthMM").isNumeric(),
    body("heightMM").isNumeric(),
    body("quantity").optional().isNumeric(),
  ],
  validateRequest,
  CalculateTableStandPrice
);

TableStandRouter.put(
  "/update/TableStand/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  UpdateTableStand
);

TableStandRouter.get("/get/TableStand", GetAllTableStand);
TableStandRouter.get("/get/TableStand/:id", GetSingleTableStand);
TableStandRouter.delete(
  "/delete/TableStand/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  DeleteTableStand
);

module.exports = { TableStandRouter };
