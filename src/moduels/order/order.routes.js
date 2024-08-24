import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  createCashOrder,
  createCheckoutSession,
  getAllOrders,
  getUserOrders,
} from "./order.controller.js";

export const orderRouter = Router();

orderRouter.route("/").get(protectedRoutes, allowedTo("admin"), getAllOrders);

orderRouter
  .route("/:id")
  .post(protectedRoutes, allowedTo("user"), createCashOrder);

orderRouter
  .route("/users")
  .get(protectedRoutes, allowedTo("user", "admin"), getUserOrders);

orderRouter
  .route("/checkout/:id")
  .post(protectedRoutes, allowedTo("user"), createCheckoutSession);
