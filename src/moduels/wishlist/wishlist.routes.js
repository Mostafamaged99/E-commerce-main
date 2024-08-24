import { Router } from "express";
import {
  addToWishList,
  getLoggedInUserWishList,
  removeFromWishList,
} from "./wishlist.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const wishlistRouter = Router();

wishlistRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addToWishList)
  .get(protectedRoutes, allowedTo("user"), getLoggedInUserWishList);

wishlistRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user", "admin"), removeFromWishList);
