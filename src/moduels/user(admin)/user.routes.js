import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { addUserVal } from "./user.validation.js";
import { addUser, allUsers, deleteUser, getUser, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";

export const userRouter = Router();

userRouter
  .route("/")
  .post(checkEmail, validate(addUserVal), addUser)
  .get(allUsers);
userRouter
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
