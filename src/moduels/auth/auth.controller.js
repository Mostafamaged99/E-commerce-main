import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../../database/models/user.model.js";
import { messages } from "../../utlities/messages.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";

const signup = catchError(async (req, res, next) => {
  // get data from req.body
  const user = new User(req.body);
  // save user
  const createdUser = await user.save();
  // create token
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      role: user.role,
    },
    process.env.JWT_KEY
  );
  // send response
  return res.status(201).json({
    message: messages.user.addedSuccessfully,
    token: `Bearer ${token}`,
    data: createdUser,
  });
});

const signIn = catchError(async (req, res, next) => {
  // check if user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(messages.user.notFound, 401));
  }
  // check if password is correct
  const isMatch = bcrypt.compareSync(req.body.password, user.password);
  if (!isMatch) {
    return next(new AppError("password is not correct", 401));
  }
  // create token
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      role: user.role,
    },
    process.env.JWT_KEY
  );
  // send response
  return res.status(200).json({
    message: "login successfully",
    token: `Bearer ${token}`,
    data: user,
  });
});

const changeUserPassword = catchError(async (req, res, next) => {
  // check if user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(messages.user.notFound, 401));
  }
  // check if password is correct
  const isMatch = bcrypt.compareSync(req.body.oldPassword, user.password);
  if (!isMatch) {
    return next(new AppError("password is not correct", 401));
  }
  //change password
  await User.findOneAndUpdate(
    { email: req.body.email },
    {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    }
  );
  // create token
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      role: user.role,
    },
    "secretKeyForLogin"
  );
  // send response
  return res.status(200).json({
    message: "password changed successfully",
    token: `Bearer ${token}`,
    data: user,
  });
});

const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  let userPayload;
  if (!token) return next(new AppError("token not found", 401));
  token = token.split(" ")[1];
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(new AppError("invalid token", 401));
    userPayload = payload;
  });
  let user = await User.findById(userPayload.id);
  if (!user) return next(new AppError("user not found", 401));
  if (user.passwordChangedAt) {
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (time > userPayload.iat) return next(new AppError("token expired", 401));
  }
  req.user = user;
  next();
});

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next();
    }
    return next(new AppError("not allowed", 401));
  });
};

export { signup, signIn, changeUserPassword, protectedRoutes, allowedTo };
