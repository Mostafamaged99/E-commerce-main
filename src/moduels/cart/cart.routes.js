import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getLoggedInUserCart,
  removeItemFromCart,
  updateQuantity,
} from "./cart.controller.js";

export const cartRouter = Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), addToCart)
  .get(protectedRoutes, allowedTo("user"), getLoggedInUserCart)
  .delete(protectedRoutes, allowedTo("user"), clearCart);

cartRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("user"), updateQuantity)
  .delete(protectedRoutes, allowedTo("user"), removeItemFromCart);

cartRouter
  .route("/apply-coupon")
  .post(protectedRoutes, allowedTo("user"), applyCoupon);
