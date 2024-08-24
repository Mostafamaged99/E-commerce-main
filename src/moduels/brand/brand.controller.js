import slugify from "slugify";
import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { Brand } from "../../../database/models/brand.model.js";
import { AppError } from "../../utlities/appError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ApiFeatures } from "../../utlities/apifeatures.js";
const __filename = fileURLToPath(import.meta.url);

const addBrand = catchError(async (req, res) => {
  // slugify the name
  req.body.slug = slugify(req.body.name);
  // get data from req.body
  req.body.logo = req.file.filename;
  const brand = new Brand(req.body);
  // save data
  await brand.save();
  // send response
  res.json({ message: messages.brand.addedSuccessfully, data: brand });
});

const allBrands = catchError(async (req, res, next) => {
  // api features
  let apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let brands = await apiFeatures.mongooseQuery.populate("createdBy");
  // send response
  if (!brands.length) {
    return next(new AppError(messages.brand.notFound, 404));
  }
  return res.json({ message: messages.brand.successGet, page: apiFeatures.pageNumber, data: brands });
});

const getBrand = catchError(async (req, res, next) => {
  // get data from req.body
  const brand = await Brand.findById(req.params.id).populate("createdBy");
  // send response
  brand || next(new AppError(messages.brand.notFound, 404));
  !brand || res.json({ message: messages.brand.successGet, data: brand });
});

const updateBrand = catchError(async (req, res, next) => {
  // slugify the name
  req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
  // get data from req.body
  if (req.file) req.body.image = req.file.filename;
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // send response
  brand || next(new AppError(messages.brand.notFound, 404));
  !brand ||
    res.json({ message: messages.brand.updatedSuccessfully, data: brand });
});

const deleteBrand = catchError(async (req, res, next) => {
  // get data from req.body
  const brand = await Brand.findByIdAndDelete(req.params.id, {
    new: true,
  });
  // send response
  brand || next(new AppError(messages.brand.notFound, 404));
  !brand ||
    res.json({ message: messages.brand.deletedSuccessfully, data: brand });
});

export { addBrand, allBrands, getBrand, updateBrand, deleteBrand };
