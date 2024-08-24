import slugify from "slugify";
import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { SubCategory } from "../../../database/models/subCategory.model.js";
import { ApiFeatures } from "../../utlities/apifeatures.js";

const addSubCategory = catchError(async (req, res) => {
  // slugify the name
  req.body.slug = slugify(req.body.name);
  // get data from req.body
  const subCategory = new SubCategory(req.body);
  // save data
  await subCategory.save();
  // send response
  res.json({
    message: messages.subCategory.addedSuccessfully,
    data: subCategory,
  });
});

const allSubCategories = catchError(async (req, res, next) => {
  // get data from req.body
  let filterObj = {};
  if (req.params.category) {
    filterObj.category = req.params.category;
  }
  // api features
  let apiFeatures = new ApiFeatures(SubCategory.find(filterObj), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let subCategories = await apiFeatures.mongooseQuery
    .populate("category")
    .populate("createdBy");
  // send response
  if (!subCategories.length) {
    return next(new AppError(messages.subCategory.notFound, 404));
  }
  return res.json({
    message: messages.subCategory.successGet,
    page: apiFeatures.pageNumber,
    data: subCategories,
  });
});

const getSubCategory = catchError(async (req, res, next) => {
  // get data from req.body
  const subCategory = await SubCategory.findById(req.params.id)
    .populate("category")
    .populate("createdBy");
  // send response
  subCategory || next(new AppError(messages.subCategory.notFound, 404));
  !subCategory ||
    res.json({ message: messages.subCategory.successGet, data: subCategory });
});

const updateSubCategory = catchError(async (req, res, next) => {
  // slugify the name
  req.body.slug = slugify(req.body.name);
  // get data from req.body
  const subCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  // send response
  subCategory || next(new AppError(messages.subCategory.notFound, 404));
  !subCategory ||
    res.json({
      message: messages.subCategory.updatedSuccessfully,
      data: subCategory,
    });
});

const deleteSubCategory = catchError(async (req, res, next) => {
  // get data from req.body
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  // send response
  subCategory || next(new AppError(messages.subCategory.notFound, 404));
  !subCategory ||
    res.json({
      message: messages.subCategory.deletedSuccessfully,
      data: subCategory,
    });
});

export {
  addSubCategory,
  allSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
