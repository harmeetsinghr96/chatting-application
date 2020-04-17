/* Importing packages */
const Sequelize = require('sequelize');

/* Creating a localhost conection */
const sequelize = new Sequelize('121-with', 'root', 'Mani8803', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;