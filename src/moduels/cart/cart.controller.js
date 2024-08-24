import { Cart } from "../../../database/models/cart.model.js";
import { Coupon } from "../../../database/models/coupon.model.js";
import { Product } from "../../../database/models/product.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { messages } from "../../utlities/messages.js";

function calcTotalPrice(isCartExist) {
  isCartExist.totalCartPrice = isCartExist.cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  if (isCartExist.discount) {
    isCartExist.totalCartPriceAfterDiscount =
      isCartExist.totalCartPrice -
      (isCartExist.discount * isCartExist.totalCartPrice) / 100;
  }
}

const addToCart = catchError(async (req, res, next) => {
  const isCartExist = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(req.body.product);

  if (!product) {
    return next(new AppError(messages.product.notFound, 404));
  }

  req.body.price = product.price;

  if (req.body.quantity > product.stock) {
    return next(new AppError("Sold out", 404));
  }

  if (!isCartExist) {
    const cart = new Cart({
      user: req.user._id,
      cartItems: [req.body],
      totalCartPrice: req.body.quantity * req.body.price, // Calculate total price initially
    });
    calcTotalPrice(cart);
    await cart.save();
    return res
      .status(201)
      .json({ message: messages.cart.addedSuccessfully, data: cart });
  } else {
    let item = isCartExist.cartItems.find(
      (item) => item.product.toString() === req.body.product
    );

    if (item) {
      item.quantity += req.body.quantity || 1;

      if (item.quantity > product.stock) {
        return next(new AppError("Sold out", 404));
      }
    } else {
      isCartExist.cartItems.push(req.body);
    }

    // Calculate totalCartPrice using reduce correctly
    calcTotalPrice(isCartExist);

    await isCartExist.save();
    return res
      .status(200)
      .json({ message: messages.cart.addedSuccessfully, data: isCartExist });
  }
});

const updateQuantity = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError(messages.cart.notFound, 404));
  console.log(cart);

  let item = cart.cartItems.find((item) => item.product == req.params.id);
  if (!item) return next(new AppError(messages.product.notFound, 404));
  item.quantity = req.body.quantity;
  calcTotalPrice(cart);
  await cart.save();
  res
    .status(200)
    .json({ message: messages.cart.updatedSuccessfully, data: cart });
});

const removeItemFromCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { product: req.params.id } } },
    { new: true }
  );
  calcTotalPrice(cart);
  await cart.save();
  cart || next(new AppError("cart not found", 404));
  !cart ||
    res.status(200).json({ message: "cart item removed successfully", cart });
});

const getLoggedInUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  cart || next(new AppError("cart not found", 404));
  !cart ||
    res.status(200).json({ message: messages.cart.successGet, data: cart });
});

const clearCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndDelete({ user: req.user._id });
  cart || next(new AppError("cart not found", 404));
  !cart ||
    res
      .status(200)
      .json({ message: messages.cart.deletedSuccessfully, data: cart });
});

const applyCoupon = catchError(async (req, res, next) => {
  let coupon = await Coupon.findOne({
    code: req.body.code,
    expiresAt: { $gt: Date.now() },
  });
  if (!coupon)
    return next(new AppError({ message: messages.coupon.notFound }, 404));
  let cart = await Cart.findOne({ user: req.user._id });
  cart.discount = coupon.discount;
  await cart.save();
  res
    .status(200)
    .json({ message: messages.coupon.addedSuccessfully, data: cart });
});

export {
  addToCart,
  updateQuantity,
  removeItemFromCart,
  getLoggedInUserCart,
  clearCart,
  applyCoupon,
};
