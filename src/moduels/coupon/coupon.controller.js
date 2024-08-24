import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { ApiFeatures } from "../../utlities/apifeatures.js";
import { Coupon } from "../../../database/models/coupon.model.js";

const addCoupon = catchError(async (req, res) => {
  // get data from req.body
  const coupon = new Coupon(req.body);
  // save data
  await coupon.save();
  // send response
  res.json({
    message: messages.coupon.addedSuccessfully,
    data: coupon,
  });
});

const allCoupons = catchError(async (req, res, next) => {
  // api features
  let apiFeatures = new ApiFeatures(Coupon.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let coupons = await apiFeatures.mongooseQuery;
  // send response
  if (!coupons.length) {
    return next(new AppError(messages.coupon.notFound, 404));
  }
  return res.json({
    message: messages.coupon.successGet,
    page: apiFeatures.pageNumber,
    data: coupons,
  });
});

const getCoupon = catchError(async (req, res, next) => {
  // get data from req.body
  const coupon = await Coupon.findById(req.params.id);
  // send response
  coupon || next(new AppError(messages.coupon.notFound, 404));
  !coupon || res.json({ message: messages.coupon.successGet, data: coupon });
});

const updateCoupon = catchError(async (req, res, next) => {
  // get data from req.body
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // send response
  coupon || next(new AppError(messages.coupon.notFound, 404));
  !coupon ||
    res.json({
      message: messages.coupon.updatedSuccessfully,
      data: coupon,
    });
});

const deleteCoupon = catchError(async (req, res, next) => {
  // get data from req.body
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  // send response
  coupon || next(new AppError(messages.coupon.notFound, 404));
  !coupon ||
    res.json({
      message: messages.coupon.deletedSuccessfully,
      data: coupon,
    });
});

export { addCoupon, allCoupons, getCoupon, updateCoupon, deleteCoupon };
