const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const OrderHistory=require('../models/orderhistory.model')
const Notification=require('../models/notification.model')




const ShopTable = sequelize.define('shop_table', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    tableName: {
        field: "table_name",
        type: DataTypes.STRING,
        allowNull: false,
    },
 
    status: {
        field: "status",
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    bookedStatus: {
        field: "booked_status",
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
    tableName: 'shop_table'
}

)
ShopTable.hasMany(OrderHistory)
ShopTable.hasMany(Notification)
OrderHistory.belongsTo(ShopTable)



module.exports = ShopTable;