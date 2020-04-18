/* importing packages */
const express = require("express");
const Route = require('../controllers/friends.controller');
const authMiddleware = require('../middlewares/isAuth.middleware');
/* Setting router to express router */
const Router = express.Router();

/* ROutes of users controller */
Router.get("/getAllUsers", authMiddleware, Route.getAllUsers);

/* Exporting a module = Router */
module.exports = Router;
