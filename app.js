const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // 3rd party middleware
}
app.use(express.json()); // This middleware parses incoming request bodies with JSON payloads
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Ok this msg from middleware");
  next();
});

app.use("/sw/v1/tours", tourRouter);
app.use("/sw/v1/users", userRouter);

// error handling => need to write this after the all routes
app.all("*", (req, res, next) => {
  // 1) Global error handling
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'failed';
  // next(err);

  // 2) Global Error class created
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling
app.use(globalErrorHandler);

module.exports = app;
