const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = () => {
  return new AppError(
    `Duplicate key error collection: Please try with new one`,
    400
  );
};

const handleValidationError = (err) => {
  return new AppError(`${err}`, 400);
};

const handleJWTError = () => {
  return new AppError(`Inavalid token. Please login again`, 401);
};

const handleJWTExpiredError = () => {
  return new AppError(`Token Expired. Please login again`, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational / trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other error dont leak error details
  } else {
    // 1) log error
    console.log("ERROR ..💣🌟");

    // 2) Send generic message
    res.status(500).json({
      status: "fail",
      message: "Something went very wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    let error = { ...err };

    // error occured when trying to handle duplicate fields error
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB();
    }

    // error when fail db connection or etc reason
    if ((error.name = "CastError")) {
      error = handleCastErrorDB(error);
    }

    // validation error occured at the time error handling
    if (error.name === "ValidatorError") {
      error = handleValidationError();
    }

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }

    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
