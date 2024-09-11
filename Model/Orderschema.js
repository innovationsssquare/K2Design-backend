const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
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
            type: {
              type: String,
            },
            value: {
              type: String,
            },
            priceAdjustment: {
              type: Number,
              default: 0,
            },
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
        visitingCard: {
          name: {
            type: String,
          },
          design: {
            type: String,
          },
          additionalCost: {
            type: Number,
            default: 0,
          },
        },
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer', 
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
