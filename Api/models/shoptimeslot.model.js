const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const OrderHistory=require('../models/orderhistory.model')





const ShopTimeSlot = sequelize.define('shop_timeslot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    startTime: {
        field: "start_time",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    endTime: {
        field: "end_time",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bookingStatus: {
        field: "booking_status",
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: 'shop_timeslot'
}

)

ShopTimeSlot.hasMany(OrderHistory)
OrderHistory.belongsTo(ShopTimeSlot)


module.exports = ShopTimeSlot;