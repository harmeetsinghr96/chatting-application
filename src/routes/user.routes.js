/* importing packages */
const express = require("express");
const Route = require('../controllers/user/user.controller');

/* Setting router to express router */
const Router = express.Router();

/* ROutes of users controller */
Router.post("/register", Route.Register);
Router.post("/login", Route.Login);
Router.put("/verification", Route.accountVerification);
Router.post("/forgot", Route.forgotPassword);
Router.put("/recoveryPassword", Route.recoveryPassword);

/* Exporting a module = Router */
module.exports = Router;
