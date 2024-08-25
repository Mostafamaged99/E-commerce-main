import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { bootstrap } from "./src/moduels/bootstrap.js";
import { AppError } from "./src/utlities/appError.js";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import "dotenv/config";
import cors from "cors";

// Uncaught exception handler
process.on("uncaughtException", () => {
  console.log("Uncaught exception error");
});

const app = express();
const port = process.env.PORT || 3000;

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
