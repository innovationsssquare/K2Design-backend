const LEDThinliteFrame = require("../../../Model/Allproductschema/Light BoardLED Board/LEDThinliteFrame");
const AppErr = require("../../../Services/AppErr");

exports.CreateLEDThinliteFrame = async (req, res, next) => {
  try {
    const frame = await LEDThinliteFrame.create(req.body);
    res.status(201).json({ status: true, data: frame });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetAllLEDThinliteFrames = async (req, res, next) => {
  try {
    const data = await LEDThinliteFrame.find();
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.GetSingleLEDThinliteFrame = async (req, res, next) => {
  try {
    const data = await LEDThinliteFrame.findById(req.params.id);
    if (!data) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.UpdateLEDThinliteFrame = async (req, res, next) => {
  try {
    const data = await LEDThinliteFrame.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, data });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.DeleteLEDThinliteFrame = async (req, res, next) => {
  try {
    const data = await LEDThinliteFrame.findByIdAndDelete(req.params.id);
    if (!data) return next(new AppErr("Product not found", 404));
    res.status(200).json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};

exports.CalculateLEDThinliteFramePrice = async (req, res, next) => {
  try {
    const { type, height, width } = req.body;
    const sqFt = (height * width);

    const product = await LEDThinliteFrame.findOne({ "configurations.type": type });
    if (!product) return next(new AppErr("Product with specified type not found", 404));

    const configuration = product.configurations.find((c) => c.type === type);
    if (!configuration) return next(new AppErr("Configuration not found", 404));

    const sizeOption = configuration.sizeRange.find(
      (range) => sqFt >= range.startSqFt && sqFt <= range.endSqFt
    );
    if (!sizeOption) return next(new AppErr("Invalid size range", 400));

    const frameCost = sizeOption.frameRatePerSqFt * sqFt;
    const printCost = sizeOption.printRatePerSqFt * sqFt;
    const totalCost = sizeOption.totalRatePerSqFt * sqFt;

    res.status(200).json({
      status: true,
      data: {
        sqFt,
        frameCost,
        printCost,
        totalCost,
      },
    });
  } catch (err) {
    next(new AppErr(err.message, 500));
  }
};
