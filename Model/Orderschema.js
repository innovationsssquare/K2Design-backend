const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false,
        },
        productName: {
          type: String,
          default: "Custom Print Product"
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        customization: {
          type: String,
          default: "",
        },
        variants: [
          {
            type: { type: String },
            value: { type: String },
            priceAdjustment: { type: Number, default: 0 },
          },
        ],
        rates: {
          unitPrice: {
            type: Number,
            required: true,
          },
          totalPrice: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: false,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: false,
    },
    customerDetails: {
      UserName: { type: String },
      UserNumber: { type: String },
      Email: { type: String },
      Address: { type: String }
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    invoiceUrl: {
      type: String,
      default: ""
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'design_review', 'printing', 'ready_for_pickup', 'completed', 'canceled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
