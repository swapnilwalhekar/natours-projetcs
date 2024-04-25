const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')

const checkID = (req, res, next, val) => {
  console.log('ok Tour id is:', val);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      staus: 'failed',
      message: 'Invalid tour ID',
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'failed',
      message: 'Missing name or price ',
    });
  }
  next();
};

// get top 5 cheap tours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
}

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().paginate();
    const allTours = await features.query;

    res.status(200).json({
      status: 'success',
      message: 'All tour list is here',
      tourCount: allTours.length,
      data: allTours,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    });
  }
};

const addTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error creating tour: ' + error,
    });
  }
};

const getSelectedTour = async (req, res) => {
  try {
    const id = req.params.id;
    const selectedTour = await Tour.findById(id);

    res.status(200).json({
      staus: 'success',
      message: 'Get selected tour',
      data: selectedTour,
    });
  } catch (error) {
    res.status(400).json({
      staus: 'failed',
      message: 'Invalid tourId, Please select a valid tourId',
    });
  }
};

const updateTour = async (req, res) => {
  try {
    /*--------option-1---------*/
    // await Tour.updateOne({ _id: req.params.id }, { $set: req.body });

    /*--------option-2---------*/
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      staus: 'success',
      message: 'Tour updated successfully',
      tour,
    });
  } catch (error) {
    res.status(400).json({
      staus: 'failed',
      message: 'Tour not found',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const selectedTour = await Tour.find({ _id: req.params.id });
    /*--------option-1---------*/
    // await Tour.deleteOne({ _id: req.params.id });

    /*--------option-2---------*/
    await Tour.findByIdAndDelete(req.params.id);

    selectedTour.length > 0
      ? res.status(200).json({
        staus: 'success',
        message: 'Tour deleted successfully',
      })
      : res.status(400).json({
        staus: 'failed',
        message: 'Tour id not exit, Please provide valid tour id',
      });
  } catch (error) {
    res.status(400).json({
      staus: 'failed',
      message: 'Tour not found',
    });
  }
};

/*------------ aggregation-pipeline --------------*/

const getTourStats = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error
    })
  }
}

const getMonthlyPlan = async (req, res, next) => {
  try {
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

  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error
    })
  }
}

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
