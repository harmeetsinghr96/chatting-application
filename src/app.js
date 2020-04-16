/**********************************
* Discription: Importing Packages *
***********************************/
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

// setting app to express function
const app = express();

// Headers have been used
app.use((req, res, next) => {
  req.header("multipart/form-data");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, form-data, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// middlewares of body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection to db
sequelize.sync()
  .then((connected) => {
    console.log('Connected');
  }).catch((disconnected) => {
    console.log('Not Connected..!!');
  })

// exporting app to server file
module.exports = app;



