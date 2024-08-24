import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Product name must be unique"],
      minLength: [3, "Product name must be at least 3 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "Product slug must be unique"],
    },
    description: {
      type: String,
      required: true,
      minLength: [
        10,
        "Product description must be at least 10 characters long",
      ],
      maxLength: [
        2000,
        "Product description must be at most 2000 characters long",
      ],
    },
    imageCover: String,
    images: [String],
    price: {
      type: Number,
      required: true,
      min: [0, "Product price can't be negative"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Product price can't be negative"],
    },
    sold: {
      type: Number,
    },
    quantity: {
      type: Number,
      min: [0, "Product can't be in negative stock"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    rateAvg: {
      type: Number,
      min: [0, "Rating can't be negative"],
      max: [5, "Rating can't be greater than 5"],
    },
    rateCount: {
      type: Number,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  }
);

schema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

schema.pre("findOne", function () {
  this.populate("reviews");
});

schema.post("init", (doc) => {
  doc.imageCover
    ? (doc.imageCover = process.env.BASE_URL + `products/` + doc.imageCover)
    : "";
  doc.images
    ? (doc.images = doc.images.map((image) => {
        return process.env.BASE_URL + `products/` + image;
      }))
    : "";
});

export const Product = model("Product", schema);
