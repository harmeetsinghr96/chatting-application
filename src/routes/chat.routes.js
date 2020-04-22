/* importing packages */
const express = require("express");
const Route = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/isAuth.middleware');
/* Setting router to express router */
const Router = express.Router();

/* ROutes of users controller */
Router.post("/sendMessage", authMiddleware, Route.newMessage);
Router.get("/getMessages", authMiddleware, Route.getMessages);

/* Exporting a module = Router */
module.exports = Router;
