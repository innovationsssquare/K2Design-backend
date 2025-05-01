const ISignWallMounted = require("../../../Model/Allproductschema/Modernproduct/iSign");
const AppErr = require("../../../Services/AppErr");

const CreateISignWallMounted = async (req, res, next) => {
  try {
    const newProduct = new ISignWallMounted(req.body);
    await newProduct.save();
    res.status(201).json({ status: true, data: newProduct });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

const CalculateISignWallMountedPrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqInch = height * width;

    const product = await ISignWallMounted.findOne({ "configurations.type": type });
    if (!product) return next(new AppErr("Product type not found", 404));

    const config = product.configurations.find((c) => c.type === type);
    if (!config || !config.sizeRange) return next(new AppErr("Configuration data missing", 404));

    const match = config.sizeRange.find(
      (r) => sqInch >= r.startSqInch && sqInch <= r.endSqInch
    );
    if (!match) return next(new AppErr("Invalid size range", 400));

    const totalPrice = match.finalSqInchRate * sqInch;

    res.status(200).json({ status: true, data: { sqInch, totalPrice } });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

const UpdateISignWallMounted = async (req, res, next) => {
  try {
    const updated = await ISignWallMounted.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: true, data: updated });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

const GetAllISignWallMounted = async (req, res, next) => {
  try {
    const data = await ISignWallMounted.find();
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

const GetSingleISignWallMounted = async (req, res, next) => {
  try {
    const product = await ISignWallMounted.findById(req.params.id);
    if (!product) return next(new AppErr("Not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

const DeleteISignWallMounted = async (req, res, next) => {
  try {
    await ISignWallMounted.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Deleted" });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

module.exports = {
  CreateISignWallMounted,
  CalculateISignWallMountedPrice,
  UpdateISignWallMounted,
  GetAllISignWallMounted,
  GetSingleISignWallMounted,
  DeleteISignWallMounted,
};
