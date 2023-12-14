const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const DishHistory = require('../models/dishorderhistory')




const OrderHistory = sequelize.define('order_history', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookedDate: {
        field: "booked_date",
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    bookedStatus: {
        field: "booked_status",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        field: "rating",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    feedback: {
        field: "feedback",
        type: DataTypes.STRING,
        allowNull: true,

    },
    totalPrice: {
        field: "total_price",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    checkedStatus: {
        field: "checked_status",
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    checkedInDate: {
        field: "checked_in_date",
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    checkedOutDate: {
        field: "checked_out_date",
        type: DataTypes.DATEONLY,
        allowNull: true,
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

}, {
    tableName: 'order_history'
}

)
OrderHistory.hasMany(DishHistory);
DishHistory.belongsTo(OrderHistory)

module.exports = OrderHistory;