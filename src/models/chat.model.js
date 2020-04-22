const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Chat = sequelize.define('chat', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    toId: { type: Sequelize.INTEGER, allowNull: false, },
    fromId: { type: Sequelize.INTEGER, allowNull: false, },
    toUser: { type: Sequelize.JSON, allowNull: false},
    fromUser: { type: Sequelize.JSON, allowNull: false},
    msg: { type: Sequelize.STRING, allowNull: false },
    messageType: { type: Sequelize.STRING, defaultValue: 'TEXT' },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = Chat;