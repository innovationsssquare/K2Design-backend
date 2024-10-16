const express = require("express");
const { IsSuperOrAdmin } = require("../MiddleWare/isSuperOrAdmin");
const {
  createOrder,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  updateOrderById,
  markOrderAsRead,
  markAllOrdersAsRead
} = require("../Controller/Order");

const OrderRouter = express.Router();

OrderRouter.post("/order/create", createOrder);

OrderRouter.get("/order/getall", getAllOrders);

OrderRouter.get("/order/getorder/:id", IsSuperOrAdmin, getOrderById);

OrderRouter.put("/order/update/:id", IsSuperOrAdmin, updateOrderById);

OrderRouter.delete("/order/delete/:id", IsSuperOrAdmin, deleteOrderById);

OrderRouter.put("/order/mark-as-read/:orderId", markOrderAsRead);

OrderRouter.patch("/order/mark-all-as-read", markAllOrdersAsRead);

module.exports = { OrderRouter };
