import Mongoose from "mongoose";

export const dbConnection = Mongoose.connect(
  "mongodb+srv://E-commerce:ycdtWbA4cDyDzh6V@cluster0.ydjbez3.mongodb.net/e-ecommercec42"
)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
