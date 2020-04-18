const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Friend = sequelize.define('friend', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = Friend;