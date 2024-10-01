const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin"); 
const { body } = require("express-validator");
const upload =require("../Services/multer")

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  UploadProduct,
  getProductsBySubcategory
} = require("../Controller/Product");

const ProductRouter = express.Router();

// Create Product
ProductRouter.post(
  "/create/product",
  upload.array("images", 6),
  body("name").notEmpty().withMessage("Product name is required"),
  body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("description").optional(),
  body("images").isArray().withMessage("Images should be an array of URLs").optional(),
  IsSuperOrAdmin,
  createProduct
);

// Get All Products
ProductRouter.get("/get/products", getAllProducts);

// Get Single Product by ID
ProductRouter.get("/get/product/:id", getProductById);

// Update Product
ProductRouter.put(
  "/update/product/:id",
  body("name").notEmpty().withMessage("Product name is required"),
  body("subcategoryId").notEmpty().withMessage("Subcategory ID is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("sku").notEmpty().withMessage("SKU is required"),
  body("description").optional(),
  body("images").isArray().withMessage("Images should be an array of URLs").optional(),
  IsSuperOrAdmin,
  updateProduct
);

// Delete Product
ProductRouter.delete("/delete/product/:id", IsSuperOrAdmin, deleteProduct);
ProductRouter.patch("/upload/product-image/:id", upload.array("images", 5), IsSuperOrAdmin, UploadProduct);
// ProductRouter.js
ProductRouter.get("/getsubcategoryproducts/:subcategoryId", getProductsBySubcategory);

module.exports ={ ProductRouter};
