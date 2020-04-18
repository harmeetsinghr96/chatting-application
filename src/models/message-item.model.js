const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const MessageItem = sequelize.define('messageItem', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    to: { type: Sequelize.INTEGER, allowNull: false, },
    from: { type: Sequelize.INTEGER, allowNull: false, },
    msgContent: { type: Sequelize.STRING, allowNull: false },
    messageType: { type: Sequelize.STRING, defaultValue: 'TEXT' },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = MessageItem;