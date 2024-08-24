import Joi from "joi";

export const addCouponVal = Joi.object({
  code: Joi.string().min(1).max(20).required(),
  expiresAt: Joi.date().optional(),
  discount: Joi.number().required(),
  image: Joi.string().optional(),
});
