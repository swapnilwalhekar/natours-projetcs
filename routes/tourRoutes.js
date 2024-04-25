const express = require('express');
const {
  getAllTours,
  addTour,
  getSelectedTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id', (req, res, next, val) => {
//   //  val is the value of parameter extracted from URL parameter
//   console.log('ok val:', val);
//   next();
// });

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(addTour);

router.route('/:id').get(getSelectedTour).patch(updateTour).delete(deleteTour);

module.exports = router;
