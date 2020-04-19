const Sequelize = require('sequelize');
const sequelize = require('../../util/database');

const User = sequelize.define('user', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: Sequelize.STRING, allowNull: false },
    verified: {  type: Sequelize.BOOLEAN, defaultValue: false },
    active: {  type: Sequelize.BOOLEAN, defaultValue: true },
    userRole: { type: Sequelize.STRING, defaultValue: 'USER' },
    deviceType: { type: Sequelize.STRING, allowNull: false },
    accountVerificationToken: { type: Sequelize.STRING },
    forgotPasswordToken: { type: Sequelize.STRING },
    forgotPasswordTokenExpire: { type: Sequelize.DATE },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = User;