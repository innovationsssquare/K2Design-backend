const Category = require('../Model/Category ');
const AppErr = require('../Services/AppErr'); // Custom error handling class (optional)
const Methods = require("../Services/GlobalMethod/Method");
const SubcategoryModel = require('../Model/Subcategories')
const ProductModel = require('../Model/Product');


const Api = new Methods();

// Create a new category
const createCategory = async (req, res, next) => {
  try {
    const { name, description,image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new AppErr('Category already exists', 400));
    }

    const newCategory = new Category({
      name,
      description,
      image
    });

    await newCategory.save();

    return res.status(201).json({
      status: true,
      statuscode: 201,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: categories,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get a single category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return next(new AppErr('Category not found', 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: category,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update a category by ID
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return next(new AppErr('Category not found', 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete a category by ID
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(new AppErr('Category not found', 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};


const getCategoryHierarchy = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate({
        path: 'subcategories',
        populate: {
          path: 'products',
        },
      });

    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: categories,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const UploadCategory = async (req, res, next) => {
  try {
    // Find the category by ID
    const category = await Category.findByIdAndUpdate(req.params.id);
    if (!category) {
      return next(new AppErr('Category not found', 404));
    }

    // Check if an image was uploaded
    if (!req.file) {
      return next(new AppErr('No image file provided', 400));
    }

    // Update the category with the image URL from Cloudinary
    category.image = req.file.path; // Cloudinary URL is stored in `req.file.path`
    await category.save();

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: 'Category image uploaded successfully',
      data: category,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
  UploadCategory
};
