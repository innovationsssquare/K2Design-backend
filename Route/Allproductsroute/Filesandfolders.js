const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { IsSuperAdmin } = require("../../MiddleWare/IsSuperAdmin");
const {
  addFilesAndFoldersProduct,
  getAllFilesAndFolders,
  calculateFilesAndFoldersPrice,
  getSingleFilesAndFolders,
  updateFilesAndFoldersProduct,
  deleteFilesAndFoldersProduct,
} = require("../../Controller/Allproductcontroller/FilesFolders");

const FilesAndFoldersRouter = express.Router();

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create Files & Folders product
FilesAndFoldersRouter.post(
  "/create/files-and-folders",
  [
    body("sku").notEmpty().withMessage("SKU is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("images").isArray().withMessage("Images must be an array"),
    body("configurations")
      .isArray({ min: 1 })
      .withMessage("Configurations must be provided as an array"),
    body("configurations.*.productType")
      .notEmpty()
      .withMessage("Product Type is required")
      .isIn(["Premium Board Files", "Paper Files", "Plastic Files"])
      .withMessage("Invalid product type"),
    body("configurations.*.paperType")
      .notEmpty()
      .withMessage("Paper Type is required"),
    body("configurations.*.size")
      .notEmpty()
      .withMessage("Size is required"),
    body("configurations.*.quantityOptions")
      .isArray({ min: 1 })
      .withMessage("Quantity options must be provided"),
  ],
  validateRequest,
  // IsSuperAdmin,
  addFilesAndFoldersProduct
);

// Route to calculate Files & Folders price
FilesAndFoldersRouter.post(
  "/calculatePrice/files-and-folders",
  [
    body("productType").notEmpty().withMessage("Product Type is required"),
    body("paperType").notEmpty().withMessage("Paper Type is required"),
    body("size").notEmpty().withMessage("Size is required"),
    body("quantity")
      .isNumeric()
      .withMessage("Quantity must be provided and numeric"),
  ],
  validateRequest,
  calculateFilesAndFoldersPrice
);

// Route to update Files & Folders product
FilesAndFoldersRouter.put(
  "/update/files-and-folders/:id",
  [
    param("id").isMongoId().withMessage("Invalid Files & Folders ID"),
    body("sku").optional().notEmpty().withMessage("SKU cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description is required"),
    body("images").optional().isArray().withMessage("Images must be an array"),
  ],
  validateRequest,
  IsSuperAdmin,
  updateFilesAndFoldersProduct
);

// Route to get all Files & Folders products
FilesAndFoldersRouter.get("/get/files-and-folders", getAllFilesAndFolders);

// Route to get a single Files & Folders product by ID
FilesAndFoldersRouter.get(
  "/get/files-and-folders/:id",
  [param("id").isMongoId().withMessage("Invalid Files & Folders ID")],
  validateRequest,
  getSingleFilesAndFolders
);

// Route to delete a Files & Folders product by ID
FilesAndFoldersRouter.delete(
  "/delete/files-and-folders/:id",
  [param("id").isMongoId().withMessage("Invalid Files & Folders ID")],
  validateRequest,
  IsSuperAdmin,
  deleteFilesAndFoldersProduct
);

module.exports = { FilesAndFoldersRouter };
