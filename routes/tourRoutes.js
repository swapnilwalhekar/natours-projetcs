const express = require('express');
const {
  getAllTours,
  addTour,
  getSelectedTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id', (req, res, next, val) => {
//   //  val is the value of parameter extracted from URL parameter
//   console.log('ok val:', val);
//   next();
// });

router.route('/').get(getAllTours).post(addTour);

router.route('/:id').get(getSelectedTour).patch(updateTour).delete(deleteTour);

module.exports = router;
