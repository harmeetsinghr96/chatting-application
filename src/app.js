/* Importing packages */
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

/* Requiring models of Tables */
const User = require('./models/user/user.model');
const Friends = require('./models/friends/friends.model');
const MessageList = require('./models/messages/message-list.model');
const MessageItem = require('./models/messages/message-item.model');

/* Importing Routes */
const users = require('./routes/user.routes');
const friends = require('./routes/friends.routes');

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
User.hasMany(MessageList);
MessageList.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Friends);
Friends.belongsTo(User);
MessageList.belongsToMany(User, { through: MessageItem });
User.belongsToMany(MessageList, { through: MessageItem });

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

/* exporting app to server file */
module.exports = app;



