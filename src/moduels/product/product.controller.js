import slugify from "slugify";
import { Product } from "../../../database/models/product.models.js";
import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { ApiFeatures } from "../../utlities/apifeatures.js";

const addProduct = catchError(async (req, res) => {
  // slugify the name
  req.body.slug = slugify(req.body.name);
  // get data from req.body
  req.body.imageCover = req.files.imageCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);
  const product = new Product(req.body);
  // save data
  await product.save();
  // send response
  res.json({ message: messages.product.addedSuccessfully, data: product });
});

const allProducts = catchError(async (req, res, next) => {
  // api features
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let products = await apiFeatures.mongooseQuery
    .populate("category")
    .populate("subCategory")
    .populate("brand")
    .populate("createdBy");
  // send response
  products || next(new AppError(messages.product.notFound, 404));
  !products ||
    res.json({
      message: messages.product.successGet,
      page: apiFeatures.pageNumber,
      data: products,
    });
});

const getProduct = catchError(async (req, res, next) => {
  // get data from req.body
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("subCategory")
    .populate("brand")
    .populate("createdBy");
  // send response
  product || next(new AppError(messages.product.notFound, 404));
  !product || res.json({ message: messages.product.successGet, data: product });
});

const updateProduct = catchError(async (req, res, next) => {
  // Slugify the name
  req.body.name ? (req.body.slug = slugify(req.body.name)) : "";
  // Handle image files
  if (req.files) {
    if (req.files.imageCover && req.files.imageCover.length) {
      req.body.imageCover = req.files.imageCover[0].filename;
    }
    if (req.files.images && req.files.images.length) {
      req.body.images = req.files.images.map((img) => img.filename);
    }
  }
  // Update product in the database
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }
  res.json({
    message: messages.product.updatedSuccessfully,
    data: product,
  });
});

const deleteProduct = catchError(async (req, res, next) => {
  // get data from req.body
  const product = await Product.findByIdAndDelete(req.params.id, {
    new: true,
  });
  // send response
  product || next(new AppError(messages.product.notFound, 404));
  !product ||
    res.json({ message: messages.product.deletedSuccessfully, data: product });
});

export { addProduct, allProducts, getProduct, updateProduct, deleteProduct };
