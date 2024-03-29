const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); // This middleware parses incoming request bodies with JSON payloads

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    tourCount: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getSelectedTour = (req, res) => {
  const id = req.params.id * 1; // convert id from string to number
  const selectedTour = tours.find((el) => el.id === id);

  selectedTour
    ? res.status(200).json({
        status: 'success',
        data: {
          tours: selectedTour,
        },
      })
    : res.status(404).json({
        staus: 'fail',
        message: 'Tour id not found',
      });
};

const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        message: 'Tour added successfully',
        data: {
          tours: tours,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;

  const tourIndex = tours.findIndex((el) => el.id === id);

  // updated a startDates of requested id tour
  tours[tourIndex].startDates = [
    req.body.data1,
    req.body.data2,
    req.body.data3,
  ];

  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour id not found',
    });
  }

  // updated startDates with patch method and update in json file also
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'Success',
        message: 'Tour Updated Successfully...🤗',
        data: {
          tours: tours,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  const selectedTourId = req.params.id * 1;

  const deletedTour = tours.filter((tour) => tour.id === selectedTourId);
  const afterDeleteTour = tours.filter((tour) => tour.id !== selectedTourId);

  if (selectedTourId > tours.length || selectedTourId < 0) {
    res.status(404).json({
      status: 'Failed',
      message: 'Tour Id not found',
    });
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(afterDeleteTour),
    (err) => {
      res.status(200).json({
        status: 'Success',
        message: 'Tour deleted successfully',
        deletedTour,
      });
    }
  );
};

// ======================== option-1 ========================
// app.get('/sw/v1/tours', getAllTours); // get all tours information
// app.get('/sw/v1/tours/:id', getSelectedTour); // get selected tour information
// app.post('/sw/v1/tours', addTour); // add tour
// app.patch('/sw/v1/tours/:id', updateTour); // update selected tour information ( perticular tour, not all ) in json file also
// app.delete('/sw/v1/tours/:id', deleteTour); // delete tour

// ======================== option-2 ========================
app.route('/sw/v1/tours').get(getAllTours).post(addTour);
app
  .route('/sw/v1/tours/:id')
  .get(getSelectedTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 8080;
app.listen(port, () => {
  console.log('App is listening on port:', port);
});
