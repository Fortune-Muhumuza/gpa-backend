const express = require("express");
const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv").config();

const DB = process.env.DB;
console.log("db url is", DB);

//connect to DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("app running on port", PORT);
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
