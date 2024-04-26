const AppError = require("../utils/appError")

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const handleDuplicateFieldsDB = (err, errmsg) => {
  return new AppError(`Invalid ${errmsg}`, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  // operational / trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

    // programming or other error dont leak error details
  } else {
    // 1) log error
    console.log('ERROR ..💣🌟');

    // 2) Send generic message 
    res.status(500).json({
      status: "fail",
      message: "Something went very wrong!"
    })
  }
}

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    let error = { ...err };
    
    // if (error.code === 11000) {
    //   error = handleDuplicateFieldsDB(error, err.message);
    // }
    
    if (error.name = "CastError") {
      error = handleCastErrorDB(error);
    }

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == "production") {
    let error = { ...err };

    if (error.name = "CastError") {
      error = handleCastErrorDB(error);
    }

    sendErrorProd(error, res);
  }
}

module.exports = globalErrorHandler;