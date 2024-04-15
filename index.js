const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev')); // 3rd party middleware

app.use(express.json()); // This middleware parses incoming request bodies with JSON payloads

app.use((req, res, next) => {
  console.log('Ok this msg from middleware:');
  next();
});

app.use('/sw/v1/tours', tourRouter);
app.use('/sw/v1/users', userRouter);

// 2) ROUTES HANDLER

// 3) ROUTES
// ======================== option-1 ========================
// app.get('/sw/v1/tours', getAllTours); // get all tours information
// app.get('/sw/v1/tours/:id', getSelectedTour); // get selected tour information
// app.post('/sw/v1/tours', addTour); // add tour
// app.patch('/sw/v1/tours/:id', updateTour); // update selected tour information ( perticular tour, not all ) in json file also
// app.delete('/sw/v1/tours/:id', deleteTour); // delete tour

// 4) START SERVER
const port = 8080;
app.listen(port, () => {
  console.log('App is listening on port:', port);
});
