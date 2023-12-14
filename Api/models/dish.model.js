const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const OrderHistory = require('../models/orderhistory.model')
const DishHistory=require('../models/dishorderhistory')



const Dish = sequelize.define('dish', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    dishName: {
        field: "dish_name",
        type: DataTypes.STRING,
        allowNull: false,
    },
    discription: {
        field: "discription",
        type: DataTypes.STRING,
        allowNull: false,
    },
    dishImage: {
        field: "dish_image",
        type: DataTypes.STRING,
        allowNull: false,
    },

    rating: {
        field: "rating",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        field: "price",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    dishQuantity: {
        field: "dish_quantity",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    categoryStatus: {
        field: "category_status",
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    trending: {
        field: "trending",
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    offerStatus: {
        field: "offer_status",
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

}, {
    tableName: 'dish'
}

)
Dish.hasMany(OrderHistory)
Dish.hasMany(DishHistory)
DishHistory.belongsTo(Dish)

module.exports = Dish;