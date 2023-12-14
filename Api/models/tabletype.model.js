const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const ShopTable=require('../models/shoptable.model')



const TableType = sequelize.define('table_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    tableType: {
        field: "table_type",
        type: DataTypes.STRING,
        allowNull: false,
    },
    noOfSeats: {
        field: "no_of_seats",
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
    tableName: 'table_type'
}

)
TableType.hasMany(ShopTable);
ShopTable.belongsTo(TableType)


module.exports = TableType;