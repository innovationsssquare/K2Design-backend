const TableStand = require("../../../Model/Allproductschema/Modernproduct/TableStand");
const AppErr = require("../../../Services/AppErr");

exports.CreateTableStand = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;
    const existing = await TableStand.findOne({ sku });
    if (existing) return next(new AppErr("Product with this SKU already exists", 400));

    const product = new TableStand({ name, categoryId, sku, description, images, configurations });
    await product.save();

    res.status(201).json({ status: true, message: "Product created", data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.CalculateTableStandPrice = async (req, res, next) => {
  try {
    const { type, widthMM, heightMM, quantity = 1 } = req.body;

    const product = await TableStand.findOne({ "configurations.type": type });
    if (!product) return next(new AppErr("Product type not found", 404));

    const config = product.configurations.find(cfg => cfg.type === type);
    const size = config.frameSizes.find(f =>
      f.widthMM === widthMM && f.heightMM === heightMM
    );

    if (!size) return next(new AppErr("Invalid size selected", 400));

    const totalPrice = size.customerCostWithPrint * quantity;

    res.status(200).json({
      status: true,
      data: { widthMM, heightMM, quantity, totalPrice },
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetAllTableStand = async (req, res, next) => {
  try {
    const products = await TableStand.find();
    res.status(200).json({ status: true, data: products });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetSingleTableStand = async (req, res, next) => {
  try {
    const product = await TableStand.findById(req.params.id);
    if (!product) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data: product });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.UpdateTableStand = async (req, res, next) => {
  try {
    const updated = await TableStand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Updated", data: updated });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.DeleteTableStand = async (req, res, next) => {
  try {
    await TableStand.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};
