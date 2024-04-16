const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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

const getAllTours = async (req, res) => {
  try {
    const allTours = await Tour.find({});

    res.status(200).json({
      status: 'success',
      message: 'All tour list is here',
      tourCount: allTours.length,
      data: allTours,
    });
  } catch (error) {
    res.status(404).json({
      staus: 'failed',
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
      datat: newTour,
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

module.exports = {
  getAllTours,
  getSelectedTour,
  addTour,
  updateTour,
  deleteTour,
};
