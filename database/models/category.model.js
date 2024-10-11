import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name must be at least 3 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "Category slug must be unique"],
    },
    image: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.post("init", (doc) => {
  doc.image ? (doc.image = doc.image) : "";
});

export const Category = model("Category", schema);
