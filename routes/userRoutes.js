const express = require('express');
const {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { signUp } = require('../controllers/authControlller');

const router = express.Router();

router.post('/signup', signUp)

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
