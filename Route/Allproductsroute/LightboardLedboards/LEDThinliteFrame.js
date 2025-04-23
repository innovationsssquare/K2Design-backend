const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateLEDThinliteFrame,
  UpdateLEDThinliteFrame,
  GetAllLEDThinliteFrames,
  GetSingleLEDThinliteFrame,
  DeleteLEDThinliteFrame,
  CalculateLEDThinliteFramePrice,
} = require("../../../Controller/Allproductcontroller/Ledandlightboards/LEDThinliteFrame");

const LEDThinliteFrameRouter = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

LEDThinliteFrameRouter.post(
  "/create/LEDThinliteFrame",
  [
    body("name").notEmpty(),
    body("categoryId").notEmpty(),
    body("sku").notEmpty(),
    body("images").isArray(),
  ],
  validateRequest,
  CreateLEDThinliteFrame
);

LEDThinliteFrameRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty(),
    body("height").isNumeric(),
    body("width").isNumeric(),
  ],
  validateRequest,
  CalculateLEDThinliteFramePrice
);

LEDThinliteFrameRouter.put(
  "/update/LEDThinliteFrame/:id",
  [param("id").isMongoId()],
  validateRequest,
  UpdateLEDThinliteFrame
);

LEDThinliteFrameRouter.get("/get/LEDThinliteFrame", GetAllLEDThinliteFrames);

LEDThinliteFrameRouter.get(
  "/get/LEDThinliteFrame/:id",
  [param("id").isMongoId()],
  validateRequest,
  GetSingleLEDThinliteFrame
);

LEDThinliteFrameRouter.delete(
  "/delete/LEDThinliteFrame/:id",
  [param("id").isMongoId()],
  validateRequest,
  DeleteLEDThinliteFrame
);

module.exports = { LEDThinliteFrameRouter };
