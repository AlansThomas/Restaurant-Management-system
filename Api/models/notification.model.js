const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');


const Notification = sequelize.define('notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        field: "message",
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        field: "status",
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    isRead: {
        field: "read",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    createdAt: {
        field: "created_date",
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        field: "updated_date",
        type: DataTypes.DATE,
        allowNull: false,
    },


},
    {
        tableName: 'notification'
    }
)

module.exports = Notification;