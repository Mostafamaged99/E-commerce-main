import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Brand name must be unique"],
      minLength: [1, "Brand name must be at least 1 character long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: String,
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
  doc.logo = process.env.BASE_URL + `brands/` + doc.logo;
});

export const Brand = model("Brand", schema);
