const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(db).then(() => {
  console.log('ok DB CONNECTED:');
});

/*-------------------------------------------*/

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'User must have a name'],
//   },
//   email: {
//     type: String,
//     required: [true, 'User must have a email'],
//   },
//   contact: Number,
//   location: String,
//   gender: String,
// });

// const UserModel = mongoose.model('Swapnil', userSchema);

// const userData = new UserModel({
//   name: 'Swapnil w',
//   email: 'sww@swapnil.com',
//   contact: 965487654321,
//   location: 'sangamner',
//   gender: 'male',
// });

// userData
//   .save()
//   .then((result) => {
//     console.log('ok result:', result);
//   })
//   .catch((err) => {
//     console.log('ok error:', err);
//   });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('App is listening on port:', port);
});
