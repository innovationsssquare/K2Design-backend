const OptiFrame = require("../../../Model/Allproductschema/Modernproduct/OptiFrame");
const AppErr = require("../../../Services/AppErr");

exports.CreateOptiFrame = async (req, res, next) => {
  try {
    const { name, categoryId, sku, description, images, configurations } = req.body;
    const existing = await OptiFrame.findOne({ sku });
    if (existing) return next(new AppErr("SKU already exists", 400));

    const product = await OptiFrame.create({
      name, categoryId, sku, description, images, configurations,
    });

    res.status(201).json({ status: true, data: product });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

exports.CalculateOptiFramePrice = async (req, res, next) => {
    try {
      const { type, widthMM, heightMM, qty } = req.body;
  
      if (!qty || qty <= 0) {
        return next(new AppErr("Quantity (qty) must be a positive number", 400));
      }
  
      const product = await OptiFrame.findOne({ "configurations.type": type });
      if (!product) return next(new AppErr("Product type not found", 404));
  
      const config = product.configurations.find(cfg => cfg.type === type);
      if (!config) return next(new AppErr("Configuration not found", 404));
  
      const size = config.frameSizes.find(f =>
        f.widthMM === widthMM && f.heightMM === heightMM
      );
  
      if (!size) return next(new AppErr("Invalid size selected", 400));
  
      const unitPrice = size.customerCostWithPrint;
      const printCost = config.printCostPerQty || 0;
      const totalPrice = (unitPrice + printCost) * qty;
  
      res.status(200).json({
        status: true,
        data: {
          qty,
          unitPrice,
          totalPrice,
        },
      });
    } catch (err) {
      next(new AppErr(err.message, 500));
    }
  };
  

exports.GetAllOptiFrames = async (req, res, next) => {
  try {
    const data = await OptiFrame.find();
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetSingleOptiFrame = async (req, res, next) => {
  try {
    const data = await OptiFrame.findById(req.params.id);
    if (!data) return next(new AppErr("Not found", 404));
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.UpdateOptiFrame = async (req, res, next) => {
  try {
    const data = await OptiFrame.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.DeleteOptiFrame = async (req, res, next) => {
  try {
    await OptiFrame.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};
