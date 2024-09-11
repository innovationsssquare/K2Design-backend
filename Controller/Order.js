const OrderModel = require("../Model/Orderschema");
const AppErr = require("../Services/AppErr");

// Create a new order
const createOrder = async (req, res, next) => {
  try {
    const { products, admin, branch, status, details, user } = req.body;

    const newOrder = new OrderModel({
      products,
      admin,
      branch,
      status,
      details,
      user,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find()
      .populate("products")
      .populate("admin")
      .populate("branch");
    res.status(200).json(orders);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Get a specific order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id)
      .populate("products")
      .populate("admin")
      .populate("branch");

    if (!order) return next(new AppErr("Order not found", 404));

    res.status(200).json(order);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Update an order by ID
const updateOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { products, status, details } = req.body;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { products, status, details },
      { new: true }
    );

    if (!updatedOrder) return next(new AppErr("Order not found", 404));

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await OrderModel.findByIdAndDelete(id);

    if (!deletedOrder) return next(new AppErr("Order not found", 404));

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    next(new AppErr(error.message, 500));
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
