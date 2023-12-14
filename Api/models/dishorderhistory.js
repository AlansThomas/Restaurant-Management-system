const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');



const dishHistory = sequelize.define('dish_history', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    tableName: 'dish_history'
}

)


module.exports = dishHistory;