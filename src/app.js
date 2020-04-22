/* Importing packages */
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

/* Requiring models of Tables */
const User = require('./models/user.model');
const FriendShip = require('./models/friendShip.model');
const Chat = require('./models/chat.model');


/* Importing Routes */
const users = require('./routes/user.routes');
const friends = require('./routes/friends.routes');
const chats = require('./routes/chat.routes');

/* setting app to express function */
const app = express();

/* Headers have been used */
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

/* middlewares of body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Making one to one RelatiionShip */
User.belongsToMany(User, { as: 'Friends', through: FriendShip });
User.hasMany(Chat);
Chat.belongsTo(User);

/* connection to db */
sequelize.sync({ force: false })
  .then(() => {})
  .catch((disconnected) => {
    console.log(disconnected);
    console.log('Not Connected..!!');
  });

/* Set routes to app module */
app.use("/api/user", users);
app.use("/api/friend", friends);
app.use('/api/chat', chats);

/* exporting app to server file */
module.exports = app;



