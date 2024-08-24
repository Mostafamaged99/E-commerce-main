import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User" },
    orderItems: [
      {
        product: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    totalCartPrice: { type: Number },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      phone: { type: String },
    },
    paymentType: { type: String, enum: ["cash", "card"], default: "cash" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Order = model("Order", schema);
