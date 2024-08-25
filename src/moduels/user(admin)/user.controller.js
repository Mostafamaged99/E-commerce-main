import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { ApiFeatures } from "../../utlities/apifeatures.js";
import { User } from "../../../database/models/user.model.js";

const addUser = catchError(async (req, res) => {
  // get data from req.body
  const user = new User(req.body);
  // save data
  await user.save();
  // send response
  res.json({
    message: messages.user.addedSuccessfully,
    data: user,
  });
});

const allUsers = catchError(async (req, res, next) => {
  // api features
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  // get data
  let users = await apiFeatures.mongooseQuery;
  // send response
  // if (!users.length) {
  //   return next(new AppError(messages.user.notFound, 404));
  // }
  // return res.json({
  //   message: messages.user.successGet,
  //   page: apiFeatures.pageNumber,
  //   data: users,
  // });

  users || next(new AppError(messages.user.notFound, 404));
  !users ||
    res.json({
      message: messages.user.successGet,
      page: apiFeatures.pageNumber,
      data: users,
    });
});

const getUser = catchError(async (req, res, next) => {
  // get data from req.body
  const user = await User.findById(req.params.id);
  // send response
  user || next(new AppError(messages.user.notFound, 404));
  !user || res.json({ message: messages.user.successGet, data: user });
});

const updateUser = catchError(async (req, res, next) => {
  // get data from req.body
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // send response
  user || next(new AppError(messages.user.notFound, 404));
  !user ||
    res.json({
      message: messages.user.updatedSuccessfully,
      data: user,
    });
});

const deleteUser = catchError(async (req, res, next) => {
  // get data from req.body
  const user = await User.findByIdAndDelete(req.params.id);
  // send response
  user || next(new AppError(messages.user.notFound, 404));
  !user ||
    res.json({
      message: messages.user.deletedSuccessfully,
      data: user,
    });
});

export { addUser, allUsers, getUser, updateUser, deleteUser };
