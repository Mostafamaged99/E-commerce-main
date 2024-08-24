import Joi from "joi";

export const addSubCategoryVal = Joi.object({
  name: Joi.string().min(1).max(50).required().required(),
  category: Joi.string().required(),
  image: Joi.string().optional(),
});
