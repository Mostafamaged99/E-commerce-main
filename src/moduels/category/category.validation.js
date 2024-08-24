import Joi from "joi";

export const addCategoryVal = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid(
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/jpg"
      )
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
});
