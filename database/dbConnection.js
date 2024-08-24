import Mongoose from "mongoose";

export const dbConnection = Mongoose.connect(
  "mongodb://127.0.0.1:27017/e-commerce"
)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
