import Mongoose from "mongoose";

export const dbConnection = Mongoose.connect(
  "mongodb+srv://admin:SOmg9KzSzbA5VT4z@cluster0.6hxjrrc.mongodb.net/e-commerce"
)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
