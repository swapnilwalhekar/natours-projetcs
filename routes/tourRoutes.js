const express = require('express');
const {
  getAllTours,
  addTour,
  getSelectedTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTours).post(addTour);
router.route('/:id').get(getSelectedTour).patch(updateTour).delete(deleteTour);

module.exports = router;
