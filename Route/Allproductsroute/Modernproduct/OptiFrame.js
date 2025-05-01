const express = require("express");
const { body, param, validationResult } = require("express-validator");
const {
  CreateOptiFrame,
  UpdateOptiFrame,
  GetAllOptiFrames,
  GetSingleOptiFrame,
  DeleteOptiFrame,
  CalculateOptiFramePrice,
} = require("../../../Controller/Allproductcontroller/Modernproduct/OptiFrame");

const OptiFrameRouter = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

OptiFrameRouter.post(
  "/create/OptiFrame",
  [
    body("name").notEmpty(),
    body("categoryId").notEmpty(),
    body("sku").notEmpty(),
    body("images").isArray(),
  ],
  validateRequest,
  CreateOptiFrame
);

OptiFrameRouter.post(
  "/calculatePrice",
  [
    body("type").notEmpty(),
    body("widthMM").isNumeric(),
    body("heightMM").isNumeric(),
  ],
  validateRequest,
  CalculateOptiFramePrice
);

OptiFrameRouter.get("/get/OptiFrame", GetAllOptiFrames);
OptiFrameRouter.get("/get/OptiFrame/:id", GetSingleOptiFrame);
OptiFrameRouter.put("/update/OptiFrame/:id", UpdateOptiFrame);
OptiFrameRouter.delete("/delete/OptiFrame/:id", DeleteOptiFrame);

module.exports = { OptiFrameRouter };
