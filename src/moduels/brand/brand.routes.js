import { Router } from "express";
import {
  addBrand,
  allBrands,
  deleteBrand,
  getBrand,
  updateBrand,
} from "./brand.controller.js";
import { uplaodSingleFile } from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const brandRouter = Router();

brandRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uplaodSingleFile("logo", "brands"),
    addBrand
  )
  .get(allBrands);
brandRouter
  .route("/:id")
  .get(getBrand)
  .put(
    protectedRoutes,
    allowedTo("admin", "user"),
    uplaodSingleFile("logo", "brands"),
    updateBrand
  )
  .delete(protectedRoutes, allowedTo("admin", "user"), deleteBrand);
