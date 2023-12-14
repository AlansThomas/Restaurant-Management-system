const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const Offer=require('../models/offer.model')
const Dish=require('../models/dish.model')
const OrderHistory=require('../models/orderhistory.model')

const ShopTable=require('../models/shoptable.model')
const Notification=require('../models/notification.model')
const Point=require('../models/point.model')

const ShopTimeslot=require('../models/shoptimeslot.model')


const ShopOwners = sequelize.define('shop', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        field: "email",
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    phoneNumber: {
        field: "phone_number",
        type: DataTypes.STRING,
        allowNull: true,
    },
    shopName: {
        field: "shop_name",
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        field: "password",
        type: DataTypes.STRING,
        allowNull: false,
    },

    passwordToken: {
        field: "password_token",
        type: DataTypes.STRING,
        allowNull: true,
    },
    shopImage: {
        field: "shop_image",
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        field: "address",
        type: DataTypes.STRING,
        allowNull: true,
    },
    startTime: {
        field: "start_time",
        type: DataTypes.INTEGER, // Use DataTypes.TIME if the column type is TIME
        allowNull: true,
      },
      endTime: {
        field: "end_time",
        type: DataTypes.INTEGER, // Use DataTypes.TIME if the column type is TIME
        allowNull: true,
      },
    shopStatus: {
        field: "shop_status",
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
        type: DataTypes.DATE,
        allowNull: true,
    },
},
{
    tableName:'shop'
}
);
ShopOwners.hasMany(Offer);
ShopOwners.hasMany(Dish);
Dish.belongsTo(ShopOwners)
ShopOwners.hasMany(ShopTable);
ShopOwners.hasMany(OrderHistory);
OrderHistory.belongsTo(ShopOwners)
ShopOwners.hasMany(Notification)
ShopOwners.hasMany(Point)
ShopOwners.hasMany(ShopTimeslot)
ShopTimeslot.belongsTo(ShopOwners)

module.exports = ShopOwners;