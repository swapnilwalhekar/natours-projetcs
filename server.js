const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNHANDLED REJECTION! 🛑 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(db).then(() => {
  console.log("DB CONNECTED:");
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log("App is listening on port:", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 🛑 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
