import { Router } from "express";
import {
  addSubCategory,
  allSubCategories,
  deleteSubCategory,
  getSubCategory,
  updateSubCategory,
} from "./subCategory.controller.js";
import { addSubCategoryVal } from "./subCategory.validation.js";
import { validate } from "../../middleware/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const subCategoryRouter = Router({
  mergeParams: true,
});

subCategoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validate(addSubCategoryVal),
    addSubCategory
  )
  .get(allSubCategories);
subCategoryRouter
  .route("/:id")
  .get(getSubCategory)
  .put(protectedRoutes, allowedTo("admin", "user"), updateSubCategory)
  .delete(protectedRoutes, allowedTo("admin", "user"), deleteSubCategory);
