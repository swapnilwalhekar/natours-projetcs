const User = require('../models/userModel')

const getAllUsers = async(req, res) => {
  const users = await User.find();;

  res.status(200).json({
    status: 'success',
    message: 'All user list is here',
    users
  });
};

const createUser = (req, res) => {
  res.status(200).json({
    message: 'createUser ROUTE IS NOT CREATED',
  });
};

const getUser = (req, res) => {
  res.status(200).json({
    message: 'getUser ROUTE IS NOT CREATED',
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    message: 'updateUser ROUTE IS NOT CREATED',
  });
};

const deleteUser = (req, res) => {
  res.status(200).json({
    message: 'deleteUser ROUTE IS NOT CREATED',
  });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
