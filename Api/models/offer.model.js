const { Sequelize, DataTypes } = require('sequelize');
const sequelize  = require('../dbConfiguration/databaseConnection');

const Offer = sequelize.define("offer", {

    id: {
        field: "id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true,
    },

    offerName: {
        field: "offer_name",
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        field: "description",
        type: DataTypes.STRING,
        allowNull: false,
    },

    startDate: {
        field: "start_date",
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    endDate: {
        field: "end_date",
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    discount: {
        field: "discount",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    offerType: {
        field: "offer_type",
        type: DataTypes.TINYINT,
        allowNull: false
    },

    status: {
        field: "status",
        type: DataTypes.TINYINT,
        allowNull: false
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
    tableName:'offer'
},
    {
        paranoid: true,
        deletedAt: 'deletedAt'
    },
    
);   

module.exports = Offer;