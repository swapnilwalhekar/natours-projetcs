const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(200).json({
        status: "success",
        message: "Registered successfully...!!",
        data: {
            user: newUser
        }
    })
})

module.exports = { signUp };