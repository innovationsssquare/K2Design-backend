const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  CreateTag,
  UpdateTag,
  GetAllTags,
  GetSingleTag,
  DeleteTag,
  CalculateTagPrice,
} = require("../../Controller/Allproductcontroller/Tag");

const TagsRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create Tag
TagsRouter.post(
  "/create/Tag",
  validateRequest,
  CreateTag
);

// Calculate Tag Price
TagsRouter.post(
  "/calculatePrice",
  validateRequest,
  CalculateTagPrice
);

// Get All Tags
TagsRouter.get("/get/Tags", GetAllTags);

// Get Single Tag
TagsRouter.get(
  "/get/Tag/:id",
  validateRequest,
  GetSingleTag
);

// Update Tag
TagsRouter.put(
  "/update/Tag/:id",
  validateRequest,
  UpdateTag
);

// Delete Tag
TagsRouter.delete(
  "/delete/Tag/:id",
  validateRequest,
  DeleteTag
);

module.exports = { TagsRouter };
