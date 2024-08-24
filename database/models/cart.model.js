import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "user" },
    cartItems: [
      {
        product: { type: Types.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    totalCartPrice: { type: Number },
    discount: { type: Number },
    totalCartPriceAfterDiscount: { type: Number },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Cart = model("Cart", schema);
