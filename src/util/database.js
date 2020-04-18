/* Importing packages */
const Sequelize = require('sequelize');

/* Creating a localhost conection */
const sequelize = new Sequelize(
  `${process.env.SERVER_DATABASE_ROOM}`, `${process.env.SERVER_USER}`, `${process.env.SERVER_PASSWORD}`,
  
  {
    dialect: `${process.env.SERVER_DATABASE}`,
    host: `${process.env.SERVER_NAME}`,
  }
);

module.exports = sequelize;