const ArtFrame = require("../../../Model/Allproductschema/Modernproduct/ArtFrame");
const AppErr = require("../../../Services/AppErr");

exports.CreateArtFrame = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;
    const existing = await ArtFrame.findOne({ sku });
    if (existing) return next(new AppErr("Product with this SKU already exists", 400));

    const newProduct = new ArtFrame({ name, categoryId, sku, description, images, configurations });
    await newProduct.save();

    res.status(201).json({ status: true, message: "Product created", data: newProduct });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.CalculateArtFramePrice = async (req, res, next) => {
  try {
    const { mainType, subType, height, width } = req.body;
    const sqInch = height * width;

    const product = await ArtFrame.findOne({ "configurations.mainType": mainType });
    if (!product) return next(new AppErr("Product with specified mainType not found", 404));

    const config = product.configurations.find(
      (c) => c.mainType === mainType && (!subType || c.subType === subType)
    );
    if (!config) return next(new AppErr("Configuration not found", 404));

    const sizeOption = config.sizeRange.find(
      (range) => sqInch >= range.startSqInch && sqInch <= range.endSqInch
    );
    if (!sizeOption) return next(new AppErr("Invalid size range selected", 400));

    res.status(200).json({
      status: true,
      data: {
        sqInch,
        finalRate: sizeOption.finalSqInchRate * sqInch,
        premiumFoamRate: sizeOption.premiumVinylFoam5mm * sqInch,
        canvasFoamRate: sizeOption.canvasFoam5mm * sqInch,
      },
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetAllArtFrames = async (req, res, next) => {
  try {
    const frames = await ArtFrame.find();
    res.status(200).json({ status: true, data: frames });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetSingleArtFrame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const frame = await ArtFrame.findById(id);
    if (!frame) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: frame });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.UpdateArtFrame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ArtFrame.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Updated successfully", data: updated });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.DeleteArtFrame = async (req, res, next) => {
  try {
    await ArtFrame.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};
