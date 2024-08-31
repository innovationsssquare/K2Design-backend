const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const { body } = require("express-validator");
const upload =require("../Services/multer")

const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategoryHierarchy,
  UploadCategory
} = require("../Controller/Category");

const CategoryRouter = express.Router();

//-------------Create Category Route ---------------//
CategoryRouter.post(
  "/create/category",
  body("name").notEmpty().withMessage("Category name is required"),
  IsSuperOrAdmin,
  createCategory
);

//-------------Get All Categories Route ---------------//
CategoryRouter.get("/get/categories", getAllCategories);

//-------------Get Single Category by ID Route ---------------//
CategoryRouter.get("/get/category/:id", getCategoryById);

//-------------Update Category by ID Route ---------------//
CategoryRouter.put(
  "/update/category/:id",
  body("name").notEmpty().withMessage("Category name is required"),
  IsSuperOrAdmin,
  updateCategory
);

//-------------Delete Category by ID Route ---------------//
CategoryRouter.delete("/delete/category/:id", IsSuperOrAdmin, deleteCategory);


CategoryRouter.get("/get/allcategorybyslug", getCategoryHierarchy);

CategoryRouter.patch('/upload/category-image/:id', upload.single('image'), UploadCategory);



module.exports = {CategoryRouter};
