import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.models.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utlities/appError.js";
import { messages } from "../../utlities/messages.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51Pr6WTAACvRdmmKjXmemPKuDHjSahYBZ5nq8gNX6bmgIjnGtF30QzdrDxhYrfDePyxJS83YGICWl8bwDPxR3Kr3u00ytjMF7td"
);

const createCashOrder = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  if (!cart)
    return next(new AppError({ message: messages.cart.notFound }, 404));
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;
  let order = await Order.create({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  await order.save();
  let options = cart.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, stock: -prod.quantity } },
      },
    };
  });
  await Product.bulkWrite(options);
  await Cart.findByIdAndDelete(cart._id);
  res.status(200).json({ message: messages.order.addedSuccessfully, order });
});

const getUserOrders = catchError(async (req, res, next) => {
  let orders = await Order.findOne({ user: req.user._id }).populate(
    "orderItems.product"
  );
  res.status(200).json({ message: messages.order.successGet, data: orders });
});

const getAllOrders = catchError(async (req, res, next) => {
  let orders = await Order.findOne({}).populate("orderItems.product");
  res.status(200).json({ message: messages.order.successGet, data: orders });
});

const createCheckoutSession = catchError(async (req, res, next) => {
  let cart = await Cart.findById(req.params.id);
  !cart ? next(new AppError("cart not found", 404)) : null;
  let totalOrderPrice = cart.totalCartPriceAfterDiscount || cart.totalCartPrice;
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://routecart.netlify.app/#/allOrders",
    cancel_url: "https://routecart.netlify.app/#/cart",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ message: "success", data: session });
});

export { createCashOrder, getUserOrders, getAllOrders, createCheckoutSession };
