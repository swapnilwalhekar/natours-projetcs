const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// get top 5 cheap tours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
}

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().paginate();
  const allTours = await features.query;

  res.status(200).json({
    status: 'success',
    message: 'All tour list is here',
    tourCount: allTours.length,
    data: allTours,
  });
});

const addTour = catchAsync(async (req, res, next) => {
  /*--------option-1---------*/
  // const newTour = new Tour(req.body);
  // newTour.save();

  /*--------option-2---------*/
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    staus: 'success',
    message: 'New tour added successfully',
    data: newTour,
  });
}
)

const getSelectedTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const selectedTour = await Tour.findById(id);

  if (!selectedTour) {
    return next(new AppError('Tour not found on selected id', 404));
  }

  res.status(200).json({
    staus: 'success',
    message: 'Get selected tour',
    data: selectedTour,
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  /*--------option-1---------*/
  // await Tour.updateOne({ _id: req.params.id }, { $set: req.body });

  /*--------option-2---------*/
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('Tour not found on selected id', 404));
  }

  res.status(200).json({
    staus: 'success',
    message: 'Tour updated successfully',
    tour,
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  /*--------option-1---------*/
  // const tour = await Tour.deleteOne({ _id: req.params.id });

  /*--------option-2---------*/
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('Tour not found on selected id', 404));
  }

  res.status(200).json({
    staus: 'success',
    message: 'Tour deleted successfully',
    data : null
  })
});

/*------------ aggregation-pipeline --------------*/
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } }
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    },
    // {
    //   $match: { _id : {$ne : "HARD"} }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: { stats }
  })
})

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;  //2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'      // seprate the entries when startDates having multiple array elements
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'        // add month field
      }
    },
    {
      $project: {
        _id: 0           // 0 for all fields without _id, 1 for only _id
      }
    },
    {
      $sort: {
        numTourStarts: 1   // 1 for ascending, -1 for decsending
      }
    },
    // {
    //   $limit : 2       
    // }
  ]);

  res.status(200).json({
    status: "success",
    count: plan.length,
    data: { plan }
  })
})

module.exports = {
  getAllTours,
  getSelectedTour,
  addTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
};
