const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const FriendShip = sequelize.define('friendShip', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    toId: { type: Sequelize.INTEGER, allowNull: false },
    fromId: { type: Sequelize.INTEGER, allowNull: false },
    toUser: { type: Sequelize.JSON, allowNull: false},
    fromUser: { type: Sequelize.JSON, allowNull: false},
    ischatList: { type: Sequelize.INTEGER, defaultValue: null},
    pending: { type: Sequelize.BOOLEAN, defaultValue: false },
    accept: { type: Sequelize.BOOLEAN, defaultValue: false },
    reject: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
    type: { type: Sequelize.STRING, defaultValue: 'FRIEND' }
});

module.exports = FriendShip;