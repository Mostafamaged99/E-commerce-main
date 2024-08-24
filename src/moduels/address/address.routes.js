import { Router } from "express";
import {
  addAddresses,
  getLoggedInUserAddresses,
  removeAddress,
} from "./address.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const addressRouter = Router();

addressRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addAddresses)
  .get(protectedRoutes, allowedTo("user"), getLoggedInUserAddresses);

addressRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("user", "admin"), removeAddress);
