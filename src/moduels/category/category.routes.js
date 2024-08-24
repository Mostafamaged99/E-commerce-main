import { Router } from "express";
import {
  addCategory,
  allCategories,
  deleteCategory,
  getCategory,
  updateCategory,
} from "./category.controller.js";
import { uplaodSingleFile } from "../../fileUpload/fileUpload.js";
import { validate } from "../../middleware/validate.js";
import { addCategoryVal } from "./category.validation.js";
import { subCategoryRouter } from "../subCategory/subCategory.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const categoryRouter = Router();

categoryRouter.use("/:category/sub-categories", subCategoryRouter);
categoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uplaodSingleFile("image", "categories"),
    validate(addCategoryVal),
    addCategory
  )
  .get(allCategories);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .put(
    protectedRoutes,
    allowedTo("admin", "user"),
    uplaodSingleFile("image", "categories"),
    updateCategory
  )
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    deleteCategory
  );
