import { Router } from "express";
import { changeUserPassword, signIn, signup } from "./auth.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
//import { signInVal, signUpVal } from "./auth.validation.js";
//import { asyncHandler } from "../../middlewares/asyncHandler.js";
//import { validation } from "../../middlewares/validation.js";

const authRouter = Router();

//signup
authRouter.post("/signup", checkEmail, signup);

//signIn
authRouter.post("/sign-in", signIn);

//change Password
authRouter.patch("/change-password", changeUserPassword);

export { authRouter };
