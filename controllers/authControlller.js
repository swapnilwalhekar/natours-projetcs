const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(200).json({
        status: "success",
        message: "Registered successfully...!!",
        token,
        data: {
            user: newUser
        }
    })
})

const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check email and password exit
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }
    // 2) Check if user exist and password is correct   
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return (next(new AppError('Incorrect email or password', 401)))
    }

    // 3) Everything is ok send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        message: "User login successfully...!!",
        token
    })
})

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return (next(new AppError('You are not logged in! Please log in to get access!')))
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return (next(new AppError('The user belonging to this token does no longer exit', 401)));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again', 401));
    };

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

const restrictTo = (...roles) => {
    // roles ['admin', 'lead-guide']
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}


module.exports = { signUp, logIn, protect, restrictTo };