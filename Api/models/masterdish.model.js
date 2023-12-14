const{DataTypes}=require('sequelize');
const sequelize = require('../dbConfiguration/databaseConnection');
const Dish=require('../models/dish.model')
const Offer=require('../models/offer.model')


const MasterDish=sequelize.define('masterdish',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      masterDishName: {
        field: "master_dish_name",
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    masterDishImage: {
        field: "master_dish_image",
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
        tableName:'masterdish'
    }
)
MasterDish.hasMany(Dish);
MasterDish.hasMany(Offer);
Dish.belongsTo(MasterDish)


module.exports=MasterDish;