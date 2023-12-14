const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');

const Point = sequelize.define('point', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    point: {
        field: "point",
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
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
},
{
    tableName:'point'
}
);

module.exports = Point;