const Product = require("../Model/Product");
const AppErr = require("../Services/AppErr");
const Subcategory = require("../Model/Subcategories");

const createProduct = async (req, res, next) => {
  try {
    const { name, subcategoryId, price, sku, description, images, variants } =
      req.body;

      if (variants && Array.isArray(variants)) {
        for (const variant of variants) {
          if (!variant.variantName || !variant.variantValue) {
            return next(new AppErr('All variants must have a name and value.', 400));
          }
        }
      }
  

    // Validate subcategory existence
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return next(new AppErr("Subcategory not found", 404));
    }

    // Check for existing product with the same SKU
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const imageUrls = req.files.map((file) => file.path);

    // Create product
    const newProduct = new Product({
      name,
      subcategoryId,
      price,
      sku,
      description,
      images: imageUrls,
      variants: JSON.parse(variants),
    });

    await newProduct.save();

    // Update subcategory's products array
    subcategory.products.push(newProduct._id);
    await subcategory.save();

    return res.status(201).json({
      status: true,
      statuscode: 201,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("subcategoryId");
    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: products,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//   Get Single Product by ID

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("subcategoryId");
    if (!product) {
      return next(new AppErr("Product not found", 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: product,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//   Update Product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subcategoryId, price, sku, description, images } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, subcategoryId, price, sku, description, images },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return next(new AppErr("Product not found", 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//   delete
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new AppErr("Product not found", 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const UploadProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    req.files.forEach((file) => {
      product.images.push(file.path);
    });

    await product.save();

    return res.status(200).json({
      status: true,
      message: "Product images uploaded successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get Products by Subcategory ID
// const getProductsBySubcategory = async (req, res, next) => {
//   try {
//     const { subcategoryId } = req.params;

//     // Fetch products that belong to the specified subcategory
//     const products = await Product.find({ subcategoryId }).populate("subcategoryId");

//     if (products.length === 0) {
//       return next(new AppErr("No products found for this subcategory", 404));
//     }

//     return res.status(200).json({
//       status: true,
//       statuscode: 200,
//       data: products,
//     });
//   } catch (error) {
//     return next(new AppErr(error.message, 500));
//   }
// };

const getProductsBySubcategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Find the subcategory by its slug and populate the products array
    const subcategory = await Subcategory.findOne({ slug }).populate('products');

    if (!subcategory) {
      return next(new AppErr("Subcategory not found", 404));
    }

    if (subcategory.products.length === 0) {
      return next(new AppErr("No products found for this subcategory", 404));
    }

    return res.status(200).json({
      status: true,
      statuscode: 200,
      data: subcategory.products,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};




module.exports = {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  UploadProduct,
  getProductsBySubcategory
};
