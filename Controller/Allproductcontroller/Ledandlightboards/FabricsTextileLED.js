const FabricFrames = require("../../../Model/Allproductschema/Light BoardLED Board/FabricsTextileLED");
const AppErr = require("../../../Services/AppErr");

exports.createFabricFrame = async (req, res, next) => {
  try {
    const product = await FabricFrames.create(req.body);
    res.status(201).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.getAllFabricFrames = async (req, res, next) => {
  try {
    const products = await FabricFrames.find();
    res.status(200).json({ status: true, data: products });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.getSingleFabricFrame = async (req, res, next) => {
  try {
    const product = await FabricFrames.findById(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.updateFabricFrame = async (req, res, next) => {
  try {
    const updated = await FabricFrames.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: updated });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.deleteFabricFrame = async (req, res, next) => {
  try {
    await FabricFrames.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.calculateFabricFramePrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqFt = (height * width);

    const product = await FabricFrames.findOne({ "configurations.type": type });
    if (!product) return next(new AppErr("Type not found", 404));

    const configuration = product.configurations.find((c) => c.type === type);
    if (!configuration) return next(new AppErr("Configuration not found", 404));

    const range = configuration.sizeRange.find(
      (r) => sqFt >= r.startSqFt && sqFt <= r.endSqFt
    );
    if (!range) return next(new AppErr("Invalid size range", 400));

    const totalPrice = range.finalSqFtRate * sqFt;

    res.status(200).json({ status: true, data: { sqFt, totalPrice } });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};
