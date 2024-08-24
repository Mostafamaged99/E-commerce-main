import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: [true, "Coupon code must be unique"],
    },
    expiresAt: {
      type: Date,
    },
    discount: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Coupon = model("Coupon", schema);
