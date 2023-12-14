require("dotenv").config();
const STATUS = require('../utils/status.util')
const Offer = require('../models/offer.model')
const { validationResult } = require('express-validator');
const Dish = require('../models/dish.model')
const MasterDish = require('../models/masterdish.model')
const Shop = require('../models/shopowners.model')
const ERROR_CODES = require('../utils/errorCodes.utils')
const ERROR_MESSAGES = require('../utils/errorMessages.utils');
const TableType = require('../models/tabletype.model')
const { Sequelize, where } = require('sequelize');
const GetUserView = require('../View/shop.view');
const StatusFiled = require('../utils/Statusfields')
const TimeSlot = require('../models/shoptimeslot.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ShopTable = require('../models/shoptable.model')
const OrderHistory = require('../models/orderhistory.model')
const Notifications = require('../models/notification.model')
const DishHistory = require('../models/dishorderhistory');
const ShopTimeSlot = require("../models/shoptimeslot.model");
const { GetTableView1 } = require("../View/shop.view");
const User = require("../models/user.model");
const Point = require("../models/point.model");


//SHOP LOGIN
const shopLogin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (errors.errors[0].msg.errorCode === ERROR_CODES.USER_NOT_FOUND) {
            return next(res.status(404).json(errors.errors[0].msg))
        }
        else {
            return next(res.status(400).json(errors.errors[0].msg))
        }
    }
    try {
        const user = await Shop.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return next(res.status(401).json({
                errorCode: ERROR_CODES.SHOPOWNER_NOT_FOUND,
                message: ERROR_MESSAGES.SHOPOWNER_NOT_FOUND
            }))
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            const token = generateAccessToken(user.id,
                user.email,
                req.body.password,
            );
            const refreshToken = generateRefreshToken(
                user.id,
                user.email,
                req.body.password,
            );

            res.status(200).json({
                Name: user.shopName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                shopImage: user.shopImage,
                startTime: user.startTime,
                endTime: user.endTime,
                shopStatus: user.shopStatus,
                trending: user.trending,
                status: user.status,
                accessToken: token,
                refreshToken: refreshToken
            });

        } else {
            return next(res.status(401).json({
                errorCode: ERROR_CODES.INCORRECT_PASSWORD,
                message: ERROR_MESSAGES.INCORRECT_PASSWORD
            }))
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        })
    }
};

// GENERATE ACCESSTOKEN
function generateAccessToken(id, email, password, role) {
    return jwt.sign(
        { id: id, email: email, password: password, role: role },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '60m',
        }
    );
}

// GENERATE REFERSHTOKEN
function generateRefreshToken(id, email, password, role) {
    return jwt.sign(
        { id: id, email: email, password: password, role: role },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "60m",
        }
    );
}

//GET SHOP DETAILS
const getShopDetails = async (req, res) => {
    try {
        const shops = await Shop.findOne({
            where: {
                id: req?.params?.id
            },
            attributes: {
                exclude: ["password", "passwordToken", "deletedAt", "createdAt", "updatedAt",]
            }
        });

        res.status(200).json({ shops });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error fetching shops' });
    }
};

//ADD OFFERS
const addOffer = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(res.status(400).send(errors.errors[0].msg))
    }
    let offerData = {
        masterdishId: req.body.masterdishId,
        shopId: req.currentShopObj.shopID,
        offerName: req.body.offerName,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        discount: req.body.discount,
        offerType: StatusFiled.offerStatus.Shop,
        status: STATUS.ACTIVE,
    }

    let offerType = {
        offerStatus: 1
    }
    try {
        await Offer.create(offerData);

        await MasterDish.update(offerType, {
            where: {
                id: req.body?.masterdishId
            },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "masterdishId", "shopId"]
            }
        })

        await Dish.update(offerType, {
            where: {
                masterdishId: req.body?.masterdishId
            },
            attributes: {
                exclude: ["deletedAt", "createdAt", "updatedAt", "masterdishId", "shopId"]
            }
        })
        res.status(200).json(offerData);

    } catch (error) {
        res.status(500).json({

            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}


//UPDATE OFFERS
const updateOffer = async (req, res, next) => {
    let Id = req.params.id;
    let updatedOffer = {}
    let updatedData = {}
    const offerData = await Offer.findOne({
        where: {
            id: Id,
            // shopId:req.shop.id
        }
    });
    console.log(Id, "678909876");
    if (!offerData) {
        res.status(404).json({
            errorCode: ERROR_CODES.OFFER_NOT_FOUND,
            message: ERROR_MESSAGES.OFFER_NOT_FOUND
        })
    }
    else {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(res.status(400).json(errors.errors[0].msg))
        }
        try {
            updatedData = {
                'masterdishId': req.body.masterdishId,
                'shopId': req.currentShopObj.shopID,
                'offerName': req.body.offerName,
                'description': req.body.description,
                'startDate': req.body.startDate,
                'endDate': req.body.endDate,
                'discount': req.body.discount,
            }
            await Offer.update(
                updatedData,
                {
                    where:
                    {
                        id: Id
                    }
                }
            );
            updatedOffer = await Offer.findOne({
                where: {
                    id: Id
                },
                attributes: {
                    exclude: ["deletedAt", "createdAt", "updatedAt", "masterdishId", "shopId"]
                }
            })
            res.status(200).json(updatedOffer)
        }


        catch (error) {
            console.log(error);
            res.status(500).json({
                errorCode: ERROR_CODES.UNEXPECTED_ERROR,
                message: ERROR_MESSAGES.UNEXPECTED_ERROR
            });
        }
    }

}

//ADD DISH
const addDish = async (req, res, next) => {
    try {
        const dish = await Dish.create({
            shopId: req.body.shopId,
            masterdishId: req.body.masterdishId,
            dishName: req.body.dishName,
            discription: req.body.discription,
            dishImage: req.file.path,
            price: req.body.price,
            categoryStatus: req.body.categoryStatus,
            dishQuantity: req.body.dishQuantity,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        res.status(200).send(dish)
    } catch (error) {
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//DELETE DISH
const deleteDish = async (req, res, next) => {
    try {
        const dish = await Dish.findOne({ where: { status: STATUS.ACTIVE, id: req.params?.id, shopId: req.currentShopObj.shopID } })
        if (!dish) {
            return res.status(404).json({
                errorCode: ERROR_CODES.DISH_NOT_FOUND,
                message: ERROR_MESSAGES.DISH_NOT_FOUND
            })
        }
        else {
            await Dish.destroy({
                where: {
                    id: req.params.id, status: STATUS.ACTIVE
                },
            });
        }
        return res.status(200).json({ Message: " Dish deleted succesffuly" })
    } catch (error) {
        console.log(error, "1111111");
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//DELETE OFFERS
const deleteOffer = async (req, res, next) => {

    try {
        const offer = await Offer.findOne({
            where: {
                id: req.params.id,
            }
        });
        if (!offer) {
            res.status(404).json({
                errorCode: ERROR_CODES.OFFER_NOT_FOUND,
                message: ERROR_MESSAGES.OFFER_NOT_FOUND
            })
        }
        else {
            await Offer.destroy({
                where: {
                    Id: req.params.id
                },
            });
            res.status(200)
                .json({
                    message: "Offer deleted successfully.."
                })
        }
    }
    catch (error) {
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//GET DISH
const getDish = async (req, res, next) => {
    const page = parseInt(req.query?.page) || 1;
    const perPage = parseInt(req.query?.limit) || null;
    const searchQuery = req.query?.search || '';

    try {
        const offset = (page - 1) * perPage;
        const searchCondition = searchQuery
            ? {
                [Sequelize.Op.or]: [
                    { dishName: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                ],
            }
            : {};
        const shops = await Dish.findAll({
            where: searchCondition,
            offset, status: STATUS.ACTIVE,
            limit: perPage,
            order: [['createdAt', 'DESC']],
            include: [MasterDish],
        });
        const totalCount = await Dish.count({
            where: searchCondition, status: STATUS.ACTIVE
        });

        res.json({
            shops,
            page,
            perPage,
            totalCount,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });

    }
}

//GET DISH SHOPWISE
const getDishShopwise = async (req, res, next) => {
    console.log("67890");
    const page = parseInt(req.query?.page) || 1;
    const perPage = parseInt(req.query?.limit) || 5;
    const searchQuery = req.query?.search || '';

    try {
        const offset = (page - 1) * perPage;
        const searchCondition = searchQuery
            ? {
                [Sequelize.Op.or]: [
                    { dishName: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                ],
            }
            : {};
        const shops = await Dish.findAll({
            where: {
                shopId: req.currentShopObj?.shopID,
                status: STATUS.ACTIVE,
                ...searchCondition, // Spread the searchCondition object inside the where clause
            },
            offset,
            limit: perPage,
            order: [['createdAt', 'DESC']],
            include: [MasterDish, Shop],
        });
        const totalCount = await Dish.count({
            where: {
                status: STATUS.ACTIVE, // Filter dishes with active status
                shopId: req.currentShopObj?.shopID, // Filter dishes with shopId equal to 1
                ...searchCondition
            },

        });


        res.json({
            shops,
            page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
        });
    }
    catch (error) {
        console.log(error, "000");
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//Get offer
const getShopOffers = async (req, res, next) => {
    const page = parseInt(req.query?.page) || 1;
    const perPage = parseInt(req.query?.limit) || 5;
    const searchQuery = req.query?.search || '';

    try {
        const offset = (page - 1) * perPage;
        const searchCondition = searchQuery
            ? {
                [Sequelize.Op.or]: [
                    { offerName: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                ],
            }
            : {};
        const offers = await Offer.findAll({
            where: searchCondition,
            offset, status: STATUS.ACTIVE,
            limit: perPage,
            order: [['createdAt', 'DESC']],
        });
        const totalCount = await Offer.count({
            where: searchCondition, status: STATUS.ACTIVE
        });

        res.json({
            offers,
            page,
            perPage,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });

    }

}

//GET DISH FILTER
const getDishFilter = async (req, res, next) => {

    try {
        let maxPrice
        const priceFilter = await Dish.findAll({
            where: { status: STATUS.ACTIVE },
            order: [['price', 'DESC']],
            include: [MasterDish],
        });
        if (priceFilter.length > 0) {
            maxPrice = priceFilter[0].price
        }
        const page = parseInt(req.body?.page) || 1;
        const perPage = parseInt(req.body?.limit) || null;
        const searchQuery = req.body?.search || '';
        const min = req.body?.min || 0
        const max = req.body?.max || maxPrice
        const offer = req.body?.offer || 0
        const category = req.body?.category || 0
        const trending = req.body?.trending || 0
        const offset = (page - 1) * perPage;
        const filters = {};
        filters.dishName = {
            [Sequelize.Op.like]: `%${searchQuery}%`,

        }
        if (min !== undefined && max !== undefined) {
            filters.price = {
                [Sequelize.Op.between]: [min, max],
            };
        }
        //  category filter
        if (category !== undefined) {
            filters.categoryStatus = category;
        }

        //  offer filter
        if (offer !== undefined) {
            filters.offerStatus = offer;
        }

        //  trending filter
        if (trending !== undefined) {
            filters.trending = trending;
        }

        const shops = await Dish.findAll({
            where: filters,
            offset, status: STATUS.ACTIVE,
            limit: perPage,
            order: [['createdAt', 'DESC']],
            include: [MasterDish, Shop],
        });
        const totalCount = await Dish.count({
            where: filters,
            offset, status: STATUS.ACTIVE,
        });
        // const userView = new GetUserView(shops);
        res.json({
            shops,
            page,
            perPage,
            totalCount,
            maxPrice
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//GET DISH SHOPWISE
const getDishFilterShopwise = async (req, res, next) => {
    try {
        let maxPrice
        const priceFilter = await Dish.findAll({
            where: { status: STATUS.ACTIVE },
            order: [['price', 'DESC']],
            include: [MasterDish],
        });
        if (priceFilter.length > 0) {
            maxPrice = priceFilter[0].price
        }
        const page = parseInt(req.body?.page) || 1;
        const perPage = parseInt(req.body?.limit) || null;
        const searchQuery = req.body?.search || '';
        const min = req.body?.min || 0
        const max = req.body?.max || maxPrice
        const offer = req.body?.offer || 0
        const category = req.body?.category || 0
        const trending = req.body?.trending || 0

        const offset = (page - 1) * perPage;
        const filters = {};
        if (req.body.masterdishId) {
            filters.masterdishId = req.body?.masterdishId
        }
        if (req.body?.shopId) {
            filters.shopId = req.body?.shopId
        }
        filters.dishName = {
            [Sequelize.Op.like]: `%${searchQuery}%`,

        }
        if (min !== undefined && max !== undefined) {
            filters.price = {
                [Sequelize.Op.between]: [min, max],
            };
        }
        // Add category filter
        if (category !== undefined) {
            filters.categoryStatus = category;
        }

        // Add offer filter
        if (offer !== undefined) {
            filters.offerStatus = offer;
        }

        // Add trending filter
        if (trending !== undefined) {
            filters.trending = trending;
        }

        const shops = await Dish.findAll({
            where: filters,
            offset, status: STATUS.ACTIVE,
            limit: perPage,
            order: [['createdAt', 'DESC']],
            include: [Shop, MasterDish],
        });
        const totalCount = await Dish.count({
            where: filters,
            limit: perPage,
            offset, status: STATUS.ACTIVE
        });
        res.json({
            shops,
            page,
            perPage,
            totalCount,
            maxPrice,
            totalPages: Math.ceil(totalCount / perPage),
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });

    }
}

//ADD TIMESLOT
const addTimeSlot = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(res.status(400).send(errors.errors[0].msg))
    }

    try {
        const shop = await Shop.findOne({ where: { status: STATUS.ACTIVE, id: req.currentShopObj?.shopID } })
        console.log(shop, "7666");

        if (!shop) {
            res.status(404).json({
                errorCode: ERROR_CODES.SHOP_NOT_FOUND,
                message: ERROR_MESSAGES.SHOP_NOT_FOUND
            });
        }

        const startTime = req.body?.startTime
        const endTime = req.body?.endTime

        const createTimeSlot = await TimeSlot.create({
            startTime: startTime,
            endTime: endTime,
            shopId: req.currentShopObj?.shopID,
            status: STATUS.ACTIVE,
            bookingStatus: 0
            , createdAt: new Date(),
            updatedAt: new Date()

        })
        return res.status(200).json({ createTimeSlot })
    } catch (error) {
        console.log(error, "SDFG++++++++++");
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });

    }

}

//Get TIMESLOT
const getTimeSlot = async (req, res, next) => {
    try {
        const timeSlot = await ShopTimeSlot.findAll({ where: { status: STATUS.ACTIVE, shopId: req.body.shopID } })

        return res.status(200).json({ timeSlot })
    } catch (error) {
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });

    }

}

//ADD SHOP TABLES
const addShopTables = async (req, res, next) => {

    try {

        const shop = await Shop.findOne({ where: { id: req.currentShopObj?.shopID, status: STATUS.ACTIVE } })
        if (!shop) {
            return res.status(400).json({
                errorCode: ERROR_CODES.SHOP_NOT_FOUND,
                message: ERROR_MESSAGES.SHOP_NOT_FOUND
            });
        }
        const tableType = await TableType.findOne({ where: { id: req.body?.tableTypeId, status: STATUS.ACTIVE } })

        if (!tableType) {
            return res.status(400).json({
                errorCode: ERROR_CODES.TABLE_TYPE_NOT_FOUND,
                message: ERROR_MESSAGES.TABLE_TYPE_NOT_FOUND
            });
        }

        const uniqueTablename = await ShopTable.findAll({ where: { shopId: req.currentShopObj?.shopID, status: STATUS.ACTIVE, tableName: { [Sequelize.Op.eq]: req.body?.tableName } } })
        console.log(uniqueTablename, "666");

        if (uniqueTablename.length > 0) {
            return res.status(400).json({
                errorCode: ERROR_CODES.TABLE_NAME_EXIST,
                message: ERROR_MESSAGES.TABLE_NAME_EXIST
            });
        }
        const addTables = await ShopTable.create({
            tableName: req.body?.tableName,
            tableTypeId: req.body?.tableTypeId,
            shopId: req.currentShopObj?.shopID,
            bookedStatus: StatusFiled.tableStatus.AVAILABLE,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        return res.status(200).send(addTables)

    } catch (error) {
        console.log(error, "1111111");
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }

}

//GET SHOP TABLES
const getShopTables = async (req, res, next) => {
    try {
        if (req.body.time_slot_id == "") {
            if (req.params.id) {
                const tables = await ShopTable.findAll({
                    where: { status: STATUS.ACTIVE, shopId: req.params?.id },
                    include: [TableType],
                });
                return res.status(200).send(new GetTableView1(tables));
            }
        } else {
            const tables = await ShopTable.findAll({
                where: { status: STATUS.ACTIVE, shopId: req.params?.id },
                include: [TableType],
            });
            const TimeSlot = await ShopTimeSlot.findOne({
                where: {
                    id: req.body?.time_slot_id,
                    shopId: req.params?.id
                }
            });

            const orderedList = await OrderHistory.findAll({
                where: {
                    shopTimeslotId: TimeSlot.id,
                    shopId: req.params?.id,
                    bookedDate: req.body?.bookedDate
                }
            });

            let tables1 = tables.map(a_element => {
                const matchingOrder = orderedList.find(order => order.shopTableId === a_element.id);
                if (matchingOrder) {
                    return { ...a_element, bookedStatus: StatusFiled.tableStatus.BOOKED }; // If there's a matching order, set bookedStatus to Booked
                }
                return a_element;
            });

            console.log(tables1);

            return res.status(200).send(new GetTableView1(tables1));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error,
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}




// BOOK TABLE IN SHOP
const bookTable = async (req, res, next) => {

    try {

        const orderHistoryData = await OrderHistory.findOne({
            where: {
                userId: req.currentUserObj.userID,
            },
        });

        const dishID = req.body?.orderDishId;
        const bookTable = await OrderHistory.create({
            bookedDate: req.body?.bookedDate,
            totalPrice: req.body?.totalPrice,
            userId: req.currentUserObj.userID,
            shopTableId: req.body?.shopTableId,
            shopId: req.body?.shopId,
            shopTimeslotId: req.body?.shopTimeslotId,
            bookedStatus: StatusFiled.orderStatus.PLACED,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()

        })

        const userDetailes = await User.findOne({
            where: { id: req.currentUserObj.userID, status: STATUS.ACTIVE }
        })

        if (!orderHistoryData && userDetailes.registerBy) {

            const [userPoints, created] = await Point.findOrCreate({
                where: {
                    userId: userDetailes.registerBy,
                },
                defaults: {
                    point: 0,
                },
            });

            const initialPoints = userPoints.point;
            const pointsToAdd = created ? 50 : userPoints.point + 50;

            await Point.update({ point: pointsToAdd }, {
                where: {
                    userId: userDetailes.registerBy,
                },
            });

            const addedPoints = pointsToAdd - initialPoints;

            await Notifications.create({
                message: `${userDetailes.userName} made their first order and you earned ${addedPoints} points`,
                userId: userDetailes.registerBy,
                isRead: false,
                status: STATUS.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }

        //  const booked = { bookedStatus: StatusFiled.tableStatus.BOOKED }
        // await ShopTable.update(booked, { where: { id: req.body?.shopTableId } })

        dishID.forEach(async (data) => {
            await DishHistory.create({
                orderHistoryId: bookTable.id,
                dishId: data,
                status: STATUS.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date()
            })
        })

        await Notifications.create({
            message: "Order Placed Successfully",
            userId: req.currentUserObj.userID,
            shopTableId: req.body?.shopTableId,
            shopId: req.body?.shopId,
            shopTimeslotId: req.body?.shopTimeslotId,
            isRead: false,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        res.status(200).json({ message: "Order Placed Successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

//ORDER FDISH DETAILS
const orderDishDetails = async (req, res, next) => {
    let dishDetailArray = [];
    let totalPrice = 0;
    const orderDish = req.body.orderDishArray;
    try {
        for (const dishId of orderDish) {
            let dishDetails = await Dish.findOne({
                where: { status: STATUS.ACTIVE, shopId: req.params?.id, id: dishId },
                include: [MasterDish],
            });

            if (dishDetails) {
                console.log("555555");
                dishDetailArray.push(dishDetails);
                totalPrice = totalPrice + dishDetails.price
            }
        }
        console.log("hi", totalPrice);

        return res.status(200).json({
            dishDetailArray: dishDetailArray,
            totalPrice: totalPrice,
        });
    } catch (error) {
        console.error("Error fetching dish details:", error);
    }

}




module.exports = { getShopDetails, addOffer, updateOffer, deleteOffer, addDish, getDish, getShopOffers, getDishFilter, getDishFilterShopwise, shopLogin, addTimeSlot, getTimeSlot, deleteDish, getDishShopwise, bookTable, getShopTables, addShopTables, orderDishDetails }
