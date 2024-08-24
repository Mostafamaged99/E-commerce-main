import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    comment: String,
    user:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rate:{
      type: Number,
      min: [0, "Rating can't be negative"],
      max: [5, "Rating can't be greater than 5"],
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,  
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.pre(/^find/, function () {
  this.populate("user","name")
})

export const Review = model("Review", schema);
