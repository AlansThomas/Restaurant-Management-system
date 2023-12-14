const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const OrderHistory = require('../models/orderhistory.model')
const Notification = require('../models/notification.model')
const Point = require('../models/point.model')



const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        field: "email",
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: "Email Already Registered."
        },
    },
    password: {
        field: "password",
        type: DataTypes.STRING,
        allowNull: false,
    },
    userType: {
        field: "user_type",
        type: DataTypes.TINYINT,
        allowNull: false,
    },

    userName: {
        field: "user_name",
        type: DataTypes.STRING,
        allowNull: false,
    },
    passwordToken: {
        field: "password_token",
        type: DataTypes.STRING,
        allowNull: true,
    },
    registerType: {
        field: "register_type",
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    registerBy: {
        field: "reffered_by",
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    refferalCode: {
        field: 'referal_code',
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImage: {
        field: "profile_image",
        type: DataTypes.STRING,
        allowNull: true,
    },
    orderCount: {
        field: "order_count",
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    welcomeOffer: {
        field: "welcome_offer",
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },

    status: {
        field: "status",
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
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
    deletedAt: {
        field: "deleted_date",
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
}
    ,
    {
        tableName: 'user'
    });
User.hasMany(OrderHistory)
User.hasMany(Notification)
User.hasMany(Point)
OrderHistory.belongsTo(User)
Point.belongsTo(User)
module.exports = User;