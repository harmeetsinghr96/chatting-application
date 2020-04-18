const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MessageList = sequelize.define('messageList', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    to: { type: Sequelize.INTEGER, allowNull: false },
    from: { type: Sequelize.INTEGER, allowNull: false },
    title: { type: Sequelize.STRING, allowNull: false },
    messageType: { type: Sequelize.STRING, defaultValue: 'LIST' },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = MessageList;