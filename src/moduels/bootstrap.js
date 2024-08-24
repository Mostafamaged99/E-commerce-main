import { addressRouter } from "./address/address.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { brandRouter } from "./brand/brand.routes.js";
import { cartRouter } from "./cart/cart.routes.js";
import { categoryRouter } from "./category/category.routes.js";
import { couponRouter } from "./coupon/coupon.routes.js";
import { orderRouter } from "./order/order.routes.js";
import { productRouter } from "./product/product.routes.js";
import { reviewRouter } from "./review/review.routes.js";
import { subCategoryRouter } from "./subCategory/subCategory.routes.js";
import { userRouter } from "./user(admin)/user.routes.js";
import { wishlistRouter } from "./wishlist/wishlist.routes.js";

export const bootstrap = (app) => {
  app.use("/api/categories", categoryRouter);
  app.use("/api/products", productRouter);
  app.use("/api/sub-categories", subCategoryRouter);
  app.use("/api/brands", brandRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/addresses", addressRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/orders", orderRouter);
};
