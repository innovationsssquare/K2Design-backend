const LightboxBoard = require("../../../Model/Allproductschema/Light BoardLED Board/LightboxBoard");
const AppErr = require("../../../Services/AppErr");

exports.CreateLightboxBoard = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;

    const exists = await LightboxBoard.findOne({ sku });
    if (exists) return next(new AppErr("SKU already exists", 400));

    const product = new LightboxBoard({ name, categoryId, sku, description, images, configurations });
    await product.save();

    res.status(201).json({ status: true, message: "Created", data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.CalculateLightboxBoardPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqFt = height * width;

    const product = await LightboxBoard.findOne({ "configurations.type": type });
    if (!product) return next(new AppErr("Product not found", 404));

    const configuration = product.configurations.find((c) => c.type === type);
    if (!configuration) return next(new AppErr("Configuration not found", 404));

    const sizeOption = configuration.sizeRange.find(
      (range) => sqFt >= range.startSqFt && sqFt <= range.endSqFt
    );
    if (!sizeOption) return next(new AppErr("Invalid size range selected", 400));

    const totalPrice = sizeOption.finalSqFtRate * sqFt;

    res.status(200).json({ status: true, data: { sqFt, totalPrice } });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.GetAllLightboxBoards = async (req, res, next) => {
  try {
    const data = await LightboxBoard.find();
    res.status(200).json({ status: true, data });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.GetSingleLightboxBoard = async (req, res, next) => {
  try {
    const data = await LightboxBoard.findById(req.params.id);
    if (!data) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.UpdateLightboxBoard = async (req, res, next) => {
  try {
    const data = await LightboxBoard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Updated", data });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.DeleteLightboxBoard = async (req, res, next) => {
  try {
    await LightboxBoard.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Deleted" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};
