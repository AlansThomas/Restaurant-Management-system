const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const ShopTable=require('../models/shoptable.model')



const Otp = sequelize.define('otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    otp: {
        field: "otp",
        type: DataTypes.INTEGER,
        allowNull: false,
        unique:true
    },
    email: {
        field: "email",
        type: DataTypes.STRING,
        allowNull: false,
    },
    expirationTime: {
        field: "expiration_time",
        type: DataTypes.TIME,
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
    tableName: 'otp'
}

)


module.exports = Otp;