import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import {
  addCoupon,
  allCoupons,
  deleteCoupon,
  getCoupon,
  updateCoupon,
} from "./coupon.controller.js";
import { addCouponVal } from "./coupon.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

export const couponRouter = Router();

couponRouter.use(protectedRoutes, allowedTo("admin"));

couponRouter.route("/").post(validate(addCouponVal), addCoupon).get(allCoupons);
couponRouter
  .route("/:id")
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

  