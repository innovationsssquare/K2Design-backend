const FlexBanner = require("../../../Model/Allproductschema/Flexprinting/Flexbannerprinting");
const AppErr = require("../../../Services/AppErr");

// Create Flex Banner
const CreateFlexBanner = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const existingProduct = await FlexBanner.findOne({ sku });
    if (existingProduct) {
      return next(new AppErr("Product with this SKU already exists", 400));
    }

    const newFlexBanner = new FlexBanner({
      name,
      categoryId,
      sku,
      description,
      images,
      configurations,
    });

    await newFlexBanner.save();

    res.status(201).json({
      status: true,
      message: "Flex Banner created successfully",
      data: newFlexBanner,
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get All Flex Banners
const GetAllFlexBanners = async (req, res, next) => {
  try {
    const banners = await FlexBanner.find();
    res.status(200).json({ status: true, data: banners });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Calculate Price
const CalculateFlexBannerPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqft = height * width;

    const product = await FlexBanner.findOne({ "configurations.type": type });
    if (!product) {
      return next(new AppErr("Product with specified type not found", 404));
    }

    const configuration = product.configurations.find((config) => config.type === type);
    if (!configuration) {
      return next(new AppErr("Configuration for the specified type not found", 404));
    }

    const sizeOption = configuration.sizeRange.find(
      (range) => sqft >= range.startSqFt && sqft <= range.endSqFt
    );

    if (!sizeOption) {
      return next(new AppErr("Invalid size range selected", 400));
    }

    let totalPrice = sizeOption.ratePerSqFt * sqft;

    res.status(200).json({
      status: true,
      data: { sqft, totalPrice },
    });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateFlexBanner,
  GetAllFlexBanners,
  CalculateFlexBannerPrice,
};
