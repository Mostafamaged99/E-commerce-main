import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { bootstrap } from "./src/moduels/bootstrap.js";
import { AppError } from "./src/utlities/appError.js";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import "dotenv/config";
import cors from "cors";
import { catchError } from "./src/middleware/catchError.js";
import Stripe from "stripe";
import { User } from "./database/models/user.model.js";
import { Cart } from "./database/models/cart.model.js";
import { Order } from "./database/models/order.model.js";
const stripe = new Stripe(
  "sk_test_51Pr6WTAACvRdmmKjXmemPKuDHjSahYBZ5nq8gNX6bmgIjnGtF30QzdrDxhYrfDePyxJS83YGICWl8bwDPxR3Kr3u00ytjMF7td"
);

// Uncaught exception handler
process.on("uncaughtException", () => {
  console.log("Uncaught exception error");
});

const app = express();
const port = process.env.PORT || 3000;

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  catchError(async (req, res) => {
    const sig = req.headers["stripe-signature"].toString();
    let event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "whsec_ZdlhbOGJq53XC2M8BRJZBc4GKL8bqJgm"
    );
    let checkout;
    if (event.type == "checkout.session.completed") {
      checkout = event.data.object;

      // get user
      let user = await User.findOne({ email: checkout.customer_email });

      //1-get user cart by cartId
      let cart = await Cart.findById(checkout.client_reference_id);
      !cart ? next(new AppError("cart not found", 404)) : null;

      //3-create order
      let order = new Order({
        user: user._id,
        orderItems: cart.cartItems,
        shippingAddress: checkout.metadata,
        totalOrderPrice: checkout.amount_total / 100,
        paymentType: "card",
        isPaid: true,
      });
      await order.save();

      //4-increment sold & decrement stock
      let options = cart.cartItems.map((prod) => {
        return {
          updateOne: {
            filter: { _id: prod.product },
            update: { $inc: { sold: prod.quantity, stock: -prod.quantity } },
          },
        };
      });
      await Product.bulkWrite(options);

      //5-clear user cart
      await Cart.findByIdAndDelete(cart._id);
    }
    res.json({ message: "success", checkout });
  })
);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Main route
app.get("/", (req, res) => res.send("Hello World!"));

// Bootstrap application modules
bootstrap(app);

// Catch-all route for undefined paths
app.use("*", (req, res, next) =>
  next(new AppError(`Route not found ${req.originalUrl}`, 404))
);

// Global error handler
app.use(globalErrorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection error:", err);
});

// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
