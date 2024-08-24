import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { ApiFeatures } from "../../utlities/apifeatures.js";
import { Review } from "../../../database/models/review.model.js";

const addReview = catchError(async (req, res) => {
  // get data from req.body
  req.body.user = req.user._id;
  let isExist = await Review.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isExist) return next(new AppError("you created a review before", 409));
  const review = new Review(req.body);
  // save data
  await review.save();
  // send response
  res.json({ message: messages.review.addedSuccessfully, data: review });
});

const allReviews = catchError(async (req, res, next) => {
  // api features
  let apiFeatures = new ApiFeatures(Review.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let reviews = await apiFeatures.mongooseQuery;
  // send response
  if (!reviews.length) {
    return next(new AppError(messages.review.notFound, 404));
  }
  return res.json({
    message: messages.review.successGet,
    page: apiFeatures.pageNumber,
    data: reviews,
  });
});

const getReview = catchError(async (req, res, next) => {
  // get data from req.body
  const review = await Review.findById(req.params.id);
  // send response
  review || next(new AppError(messages.review.notFound, 404));
  !review || res.json({ message: messages.review.successGet, data: review });
});

const updateReview = catchError(async (req, res, next) => {
  // get data from req.body
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );
  // send response
  review || next(new AppError(messages.review.notFound, 404));
  !review ||
    res.json({ message: messages.review.updatedSuccessfully, data: review });
});

const deleteReview = catchError(async (req, res, next) => {
  // get data from req.body
  const review = await Review.findByIdAndDelete(req.params.id, {
    new: true,
  });
  // send response
  review || next(new AppError(messages.review.notFound, 404));
  !review ||
    res.json({ message: messages.review.deletedSuccessfully, data: review });
});

export { addReview, allReviews, getReview, updateReview, deleteReview };
