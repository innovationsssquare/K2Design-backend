const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateWallCalendar,
  UpdateWallCalendar,
  GetAllWallCalendars,
  GetSingleWallCalendar,
  DeleteWallCalendar,
  CalculateWallCalendarPrice,
} = require("../../Controller/Allproductcontroller/Calender");

const WallCalendarRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a wall calendar
WallCalendarRouter.post(
  "/create/WallCalendar",
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
  CreateWallCalendar
);

// Route to calculate wall calendar price
WallCalendarRouter.post(
  "/calculatePrice",
  [
    body("size").notEmpty().withMessage("Size is required"),
    body("paperType").notEmpty().withMessage("Paper Type is required"),
    body("qty").isNumeric().withMessage("Quantity must be numeric"),
  ],
  validateRequest,
  CalculateWallCalendarPrice
);

// Route to update a wall calendar
WallCalendarRouter.put(
  "/update/WallCalendar/:id",
  [
    param("id").isMongoId().withMessage("Invalid Wall Calendar ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
  ],
  validateRequest,
  UpdateWallCalendar
);

// Route to get all wall calendars
WallCalendarRouter.get("/get/WallCalendars", GetAllWallCalendars);

// Route to get a single wall calendar by ID
WallCalendarRouter.get(
  "/get/WallCalendar/:id",
  [param("id").isMongoId().withMessage("Invalid Wall Calendar ID")],
  validateRequest,
  GetSingleWallCalendar
);

// Route to delete a wall calendar by ID
WallCalendarRouter.delete(
  "/delete/WallCalendar/:id",
  [param("id").isMongoId().withMessage("Invalid Wall Calendar ID")],
  validateRequest,
  DeleteWallCalendar
);

module.exports = { WallCalendarRouter };
