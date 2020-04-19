const Sequelize = require('sequelize');
const sequelize = require('../../util/database');

const FriendRequest = sequelize.define('friendRequest', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    toId: { type: Sequelize.INTEGER, allowNull: false },
    fromId: { type: Sequelize.INTEGER, allowNull: false },
    toUser: { type: Sequelize.JSON, allowNull: false},
    fromUser: { type: Sequelize.JSON, allowNull: false},
    pending: { type: Sequelize.BOOLEAN, defaultValue: false },
    accept: { type: Sequelize.BOOLEAN, defaultValue: false },
    reject: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = FriendRequest;