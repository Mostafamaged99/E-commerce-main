import slugify from "slugify";
import { Category } from "../../../database/models/category.model.js";
import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { ApiFeatures } from "../../utlities/apifeatures.js";
import { uploadToCloudinary } from "../../fileUpload/fileUpload.js ";

const addCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  uploadToCloudinary(req.file.path, "categories")
    .then((cloudinaryImageUrl) => {
      req.body.image = cloudinaryImageUrl;
      const category = new Category(req.body);
      return category.save();
    })
    .then((category) => {
      res.json({
        message: messages.category.addedSuccessfully,
        data: category,
      });
    })
    .catch((err) => {
      next(new AppError("Error while uploading image to cloudinary", 500));
    });
});

const allCategories = catchError(async (req, res, next) => {
  // api features
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let categories = await apiFeatures.mongooseQuery.populate("createdBy");
  // send response
  if (!categories.length) {
    return next(new AppError(messages.category.notFound, 404));
  }
  return res.json({
    message: messages.category.successGet,
    page: apiFeatures.pageNumber,
    data: categories,
  });
});

const getCategory = catchError(async (req, res, next) => {
  // get data from req.body
  const category = await Category.findById(req.params.id).populate("createdBy");
  // send response
  category || next(new AppError(messages.category.notFound, 404));
  !category ||
    res.json({ message: messages.category.successGet, data: category });
});

const updateCategory = catchError(async (req, res, next) => {
  req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
  const imageUpload = req.file
    ? uploadToCloudinary(req.file.path, "categories").then(
        (cloudinaryImageUrl) => {
          req.body.image = cloudinaryImageUrl;
        }
      )
    : Promise.resolve();
  imageUpload
    .then(() => {
      return Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    })
    .then((category) => {
      if (!category) {
        next(new AppError(messages.category.notFound, 404));
      }
      res.json({
        message: messages.category.updatedSuccessfully,
        data: category,
      });
    })
    .catch((err) => {
      next(new AppError("Error while uploading image to cloudinary", 500));
    });
});

const deleteCategory = catchError(async (req, res, next) => {
  // get data from req.body
  const category = await Category.findByIdAndDelete(req.params.id);
  // send response
  category || next(new AppError(messages.category.notFound, 404));
  !category ||
    res.json({
      message: messages.category.deletedSuccessfully,
      data: category,
    });
});

export {
  addCategory,
  allCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
