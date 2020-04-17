const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: Sequelize.STRING, allowNull: false },
    userRole: { type: Sequelize.STRING, defaultValue: 'user' },
    deviceType: { type: Sequelize.STRING, allowNull: false },
    accountVerificationToken: { type: Sequelize.STRING },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = User;