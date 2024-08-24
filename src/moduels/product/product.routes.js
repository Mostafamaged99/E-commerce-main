import { Router } from "express";
import {
  addProduct,
  allProducts,
  deleteProduct,
  getProduct,
  updateProduct,
} from "./product.controller.js";
import { uplaodMixOfFiles } from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
export const productRouter = Router();

productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uplaodMixOfFiles(
      [
        { name: "imageCover", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ],
      "products"
    ),
    addProduct
  )
  .get(allProducts);
productRouter
  .route("/:id")
  .get(getProduct)
  .put(
    protectedRoutes,
    allowedTo("admin", "user"),
    uplaodMixOfFiles(
      [
        { name: "imageCover", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ],
      "products"
    ),
    updateProduct
  )
  .delete(protectedRoutes, allowedTo("admin", "user"), deleteProduct);
