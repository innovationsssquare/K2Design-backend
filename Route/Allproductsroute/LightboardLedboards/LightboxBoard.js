const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateLightboxBoard,
  UpdateLightboxBoard,
  GetAllLightboxBoards,
  GetSingleLightboxBoard,
  DeleteLightboxBoard,
  CalculateLightboxBoardPrice,
} = require("../../../Controller/Allproductcontroller/Ledandlightboards/LightboxBoard");

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/create/LightboxBoard",
  [
    body("name").notEmpty(),
    body("categoryId").notEmpty(),
    body("sku").notEmpty(),
    body("images").isArray(),
  ],
  validateRequest,
  CreateLightboxBoard
);

router.post(
  "/calculatePrice",
  [
    body("type").notEmpty(),
    body("height").isNumeric(),
    body("width").isNumeric(),
  ],
  validateRequest,
  CalculateLightboxBoardPrice
);

router.put(
  "/update/LightboxBoard/:id",
  [param("id").isMongoId()],
  validateRequest,
  UpdateLightboxBoard
);

router.get("/get/LightboxBoard", GetAllLightboxBoards);
router.get("/get/LightboxBoard/:id", [param("id").isMongoId()], validateRequest, GetSingleLightboxBoard);
router.delete("/delete/LightboxBoard/:id", [param("id").isMongoId()], validateRequest, DeleteLightboxBoard);

module.exports = { LightboxBoardRouter: router };
