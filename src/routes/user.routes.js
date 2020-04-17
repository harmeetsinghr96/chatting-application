/* importing packages */
const express = require("express");
const Route = require('../controllers/user.controller');

/* Setting router to express router */
const Router = express.Router();

/* ROutes of users controller */
Router.post("/register", Route.Register);

/* Exporting a module = Router */
module.exports = Router;
