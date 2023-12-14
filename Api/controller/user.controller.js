const ERROR_CODES = require('../utils/errorCodes.utils')
const ERROR_MESSAGES = require('../utils/errorMessages.utils');
require("dotenv").config();

const User = require('../models/user.model')
const Shop = require('../models/shopowners.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs');
const EMAIL_FUNCTION = 1
const emailTemplate = require('../utils/emailTemplate')
const MasterDish = require('../models/masterdish.model')
const ShopTable = require('../models/shoptable.model')
const Dish = require('../models/dish.model')
const STATUS = require('../utils/status.util')
const { Sequelize, DataTypes } = require('sequelize');
const registerType = require('../utils/registerType.util')
const Role = require('../utils/role.utils')
const TableType = require('../models/tabletype.model')
const Point = require('../models/point.model')
const OrderHistory = require('../models/orderhistory.model')
const TimeSlot = require('../models/shoptimeslot.model')
const STATUSFIELD = require('../utils/Statusfields')
const { GetTrndingShops, GetOrderHistoryView } = require("../View/shop.view");
const dishHistory = require('../models/dishorderhistory');
const ShopOwners = require('../models/shopowners.model');
const { json } = require('body-parser');

const currentDate = new Date().toISOString().slice(0, 10);
const currentHour = new Date().getHours();

// ADMIN LOGIN
const login = async (req, res, next) => {

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
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(404).json({

                errorCode: ERROR_CODES.USER_NOT_FOUND,
                message: 'Admin with the provided email not found'
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            const token = generateAccessToken(user.id,
                user.email,
                req.body.password,
                user.user_type,
                user.welcomeOffer);

            const refreshToken = generateRefreshToken(
                user.id,
                user.email,
                req.body.password,
                user.user_type
            );

            res.status(200).json({
                Name: user.userName,
                email: user.email,
                role: user.userType,
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
function generateAccessToken(id, email, password, role, offer) {
    return jwt.sign(
        { id: id, email: email, password: password, role: role, welcomeOffer: offer },
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
            expiresIn: "1d",
        }
    );
}

// TOKENEXPIRY-REFERSHTOKEN
const tokenRefresh = async (req, res, next) => {
    try {
        if (!req.body.refreshToken || req.body.refreshToken.trim().length === 0 || req.body.refreshToken === null) {
            return next(res.status(401).json({
                errorCode: ERROR_CODES.TOKEN_NOT_FOUND,
                message: ERROR_MESSAGES.TOKEN_NOT_FOUND
            }));
        }
        else {

            const token = req.body

            const decoded = jwt.verify(
                token.refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
            let id = decoded.id;
            const user = await User.findOne({
                where: {
                    id: id,
                    email: decoded.email,

                }
            });


            if (user) {
                const accessToken = generateAccessToken(decoded.id,
                    decoded.email,
                    decoded.password,
                    decoded.user_type);

                const refreshToken = generateRefreshToken(
                    decoded.id,
                    decoded.email,
                    decoded.password,
                    decoded.role
                );

                res.status(200).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });

            } else {

                return next(res.status(401).json({
                    errorCode: ERROR_CODES.INVALID_TOKEN,
                    message: ERROR_MESSAGES.INVALID_TOKEN
                }));
            }
        }
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(res.status(401).json({
                errorCode: ERROR_CODES.TOKEN_EXPIRED,
                message: ERROR_MESSAGES.TOKEN_EXPIRED
            }))
        }
        else {
            return next(res.status(401).json(
                {
                    errorCode: ERROR_CODES.INVALID_TOKEN,
                    message: ERROR_MESSAGES.INVALID_TOKEN
                }))
        }
    }
}

// ADD SHOP
const addShop = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(res.status(400).json(errors.errors[0].msg))
        }
        const { email, password, phoneNumber, shopName, address, startTime, endTime } = req.body;
        const unique = await Shop.findAll({ where: { email: { [Sequelize.Op.eq]: email } } })
        if (unique?.length > 0) {
            return res.status(400).json({
                errorCode: ERROR_CODES.EMAIL_ALREADY_EXIST,
                message: ERROR_MESSAGES.EMAIL_ALREADY_EXIST
            })
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        let shopImage = null;


        // Specify the path to the file
        const filePath = req.file.path; // Update with your file path

        // Read the file synchronously and convert it to a buffer
        // const fileBuffer = fs.readFileSync(filePath);
        const fileBuffer = await fs.promises.readFile(filePath);

        if (req.file) {
            // Detect the file type using the magic number
            const detectedFileType = await detectFileType(fileBuffer);
            if (!['JPEG image', 'JPG', 'PNG image', 'GIF image'].includes(detectedFileType)) {
                // Handle unsupported file formats here

                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.',
                });
            }

            // For supported file formats, directly use the uploaded image
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path;
            fs.renameSync(path, newPath);
            shopImage = newPath; // Set the shopImage field to the new file path
        }
        // if (!email || !phoneNumber || !shopName || !address || !startTime || !endTime || !shopImage) {
        //     return res.status(400).json({ success: false, status: 400, message: 'All fields are required' });
        // }

        // if (startTime < 1 || startTime > 24) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Start time must be between 1 and 24' });
        // }
        // if (endTime < 1 || endTime > 24) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Start time must be between 1 and 24' });
        // }
        // if (phoneNumber.length > 12) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Phone number must be at most 12 characters long' });
        // }
        // if (shopName.length > 25) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Shop Name must be at most 25 characters long' });
        // }
        // const multipleSpaceRegex = /\s{2,}/;
        // if (multipleSpaceRegex.test(shopName)) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Shop Name can only have one space' });
        // }
        // if (address.length > 50) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Shop Address must be at most 50 characters long' });
        // }
        // if (multipleSpaceRegex.test(address)) {

        //     return res.status(400).json({ success: false, status: 400, message: 'Shop address can only have one space' });
        // }
        // const validateEmailFormat = (emailValue) => {
        //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //     return emailRegex.test(emailValue);
        // };
        // if (!validateEmailFormat(email)) {
        //     return res.status(400).json({ success: false, status: 400, message: 'Invalid email format' });
        // }



        const shop = await Shop.create({
            email,
            password: hashedPassword,
            phoneNumber,
            shopName,
            shopImage,
            address,
            startTime,
            endTime,
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Send the response as needed
        res.json({ success: true, status: 200, message: 'Shop created successfully', shop });

        // Send email with the username and password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'restaurantmanagement.official@gmail.com',
                pass: 'xadkpircwkamohxo',
            },
        });

        const mailOptions = {
            from: 'WONDERLUST TOURS',
            to: email,
            subject: 'Shop Registration',
            html: emailTemplate.emailTemplate.replace('{{email}}', email).replace('{{password}}', password),
        };

        if (EMAIL_FUNCTION == '1') {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent successfully');
                }
            });
        }
    } catch (error) {

        return next(
            res.status(500).json({
                errorCode: ERROR_CODES.UNEXPECTED_ERROR,
                message: ERROR_MESSAGES.UNEXPECTED_ERROR,
            })
        );
    }

};
function detectFileType(buffer) {

    if (!buffer || buffer.length < 4) {
        return 'Unknown';
    }

    const magicNumbers = buffer.slice(0, 4).toString('hex');

    if (magicNumbers === '89504e47') {
        return 'PNG image';
    } else if (magicNumbers === 'ffd8ffe0' || magicNumbers === 'ffd8ffdb') {
        return 'JPG'; // JPEG image or JPG image
    } else if (magicNumbers === '47494638') {
        return 'GIF image';
    } else if (magicNumbers === '424d') {
        return 'BMP image';
    } else {
        return 'Unknown';
    }
}

//EDIT SHOP
const editShop = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(res.status(400).json(errors.errors[0].msg))
        }
        const { email, phoneNumber, shopName, address, startTime, endTime } = req.body;

        const existingShop = await Shop.findOne({ where: { id: req.params.id, status: STATUS.ACTIVE } })

        if (!existingShop) {
            return res.status(404).json({ success: false, status: 404, message: 'Shop not found' });
        }

        // Update the shop properties
        if (email) {
            const validateEmailFormat = (emailValue) => {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(emailValue);
            };
            if (!validateEmailFormat(email)) {
                return res.status(400).json({ success: false, status: 400, message: 'Invalid email format' });
            }
            existingShop.email = email;
        }
        if (startTime < 1 || startTime > 24) {

            return res.status(400).json({ success: false, status: 400, message: 'Start time must be between 1 and 24' });
        }
        if (endTime < 1 || endTime > 24) {

            return res.status(400).json({ success: false, status: 400, message: 'Start time must be between 1 and 24' });
        }

        if (phoneNumber) {
            if (phoneNumber.length > 12) {
                return res.status(400).json({ success: false, status: 400, message: 'Phone number must be at most 12 characters long' });
            }
            existingShop.phoneNumber = phoneNumber;
        }

        if (shopName) {
            if (shopName.length > 25) {
                return res.status(400).json({ success: false, status: 400, message: 'Shop Name must be at most 25 characters long' });
            }
            const multipleSpaceRegex = /\s{2,}/;
            if (multipleSpaceRegex.test(shopName)) {
                return res.status(400).json({ success: false, status: 400, message: 'Shop Name can only have one space' });
            }
            existingShop.shopName = shopName;
        }

        if (address) {
            if (address.length > 50) {
                return res.status(400).json({ success: false, status: 400, message: 'Shop Address must be at most 50 characters long' });
            }
            const multipleSpaceRegex = /\s{2,}/;
            if (multipleSpaceRegex.test(address)) {
                return res.status(400).json({ success: false, status: 400, message: 'Shop address can only have one space' });
            }
            existingShop.address = address;
        }

        if (startTime) {
            existingShop.startTime = startTime;
        }

        if (endTime) {
            existingShop.endTime = endTime;
        }

        // Update the shop image if a new one is provided
        if (req.file) {

            // Specify the path to the file
            const filePathh = req.file.path; // Update with your file path

            // Read the file synchronously and convert it to a buffer
            // const fileBuffer = fs.readFileSync(filePathh);
            const fileBuffer = await fs.promises.readFile(filePathh);

            if (req.file) {

                // Detect the file type using the magic number
                const detectedFileType = await detectFileType(fileBuffer);
                if (!['JPEG image', 'JPG', 'PNG image', 'GIF image'].includes(detectedFileType)) {
                    // Handle unsupported file formats here

                    return res.status(400).json({
                        success: false,
                        status: 400,
                        message: 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.',
                    });
                }
            }


            // Move the uploaded image to the ShopImages directory
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path;
            fs.renameSync(path, newPath);
            existingShop.shopImage = newPath; // Set the shopImage field to the new file path
        } else {
            // If no new image is provided or the image is cleared, set shopImage to null
            // existingShop.shopImage = null;
        }

        await existingShop.save();

        // Send the response as needed
        res.json({ success: true, status: 200, message: 'Shop updated successfully', shop: existingShop });

    } catch (error) {

        return res.status(500).json({
            success: false,
            status: 500,
            message: 'An unexpected error occurred',
        });
    }
};
// Pagination logic - Get shops with pagination
const getShop = async (req, res) => {
    const page = parseInt(req.query?.page) || 1;
    const perPage = parseInt(req.query?.limit) || 10;
    const searchQuery = req.query?.search || '';

    try {

        const offset = (page - 1) * perPage;
        const searchCondition = searchQuery
            ? {
                [Sequelize.Op.or]: [
                    { email: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { shopName: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                ],
            }
            : {};
        const shops = await Shop.findAll({
            where: searchCondition,
            offset,
            limit: perPage,
            order: [['createdAt', 'DESC']],
        });

        const totalCount = await Shop.count({
            where: searchCondition,
        });
        const dataOnCurrentPage = Math.min(perPage, totalCount - offset);
        res.json({
            shops,
            page,
            perPage,
            totalCounts: totalCount,
            dataOnCurrentPage: dataOnCurrentPage,
            totalPages: Math.ceil(totalCount / perPage),
        });
    } catch (error) {

        res.status(500).json({ success: false, message: 'Error fetching shops' });
    }
};

//SHOP DELETE
const deleteShop = async (req, res, next) => {
    try {
        const shop = await Shop.findOne({ where: { status: STATUS.ACTIVE, id: req.params?.id } })
        if (!shop) {
            return res.status(404).json({
                errorCode: ERROR_CODES.SHOP_NOT_FOUND,
                message: ERROR_MESSAGES.SHOP_NOT_FOUND
            })
        }
        else {
            await Shop.destroy({
                where: {
                    id: req.params.id, status: STATUS.ACTIVE
                },
            });
        }
        return res.status(200).json({ Message: " Shop deleted succesffuly" })
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }

}


// ADD MASTERDISH
const addMasterDish = async (req, res, next) => {

    try {
        const unique = await MasterDish.findAll({ where: { masterDishName: { [Sequelize.Op.eq]: req.body.masterDishName } } })
        if (unique.length > 0) {
            return res.status(400).json({
                errorCode: ERROR_CODES.MASTERDISHNAME_UNIQUE,
                message: ERROR_MESSAGES.MASTERDISHNAME_UNIQUE
            })
        }
        let masterDishImage = null;
        // Specify the path to the file
        const filePath = req.file.path; // Update with your file path

        // Read the file synchronously and convert it to a buffer
        const fileBuffer = await fs.promises.readFile(filePath);
        if (req.file) {

            // Detect the file type using the magic number
            const detectedFileType = await detectFileType(fileBuffer);
            if (!['JPEG image', 'JPG', 'PNG image', 'GIF image'].includes(detectedFileType)) {
                // Handle unsupported file formats here

                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.',
                });
            }
            // Move the uploaded image to the ShopImages directory
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path;
            fs.renameSync(path, newPath);
            masterDishImage = newPath; // Set the shopImage field to the new file path
        }
        const masterDish = await MasterDish.create({
            masterDishName: req.body.masterDishName,
            masterDishImage,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()


        })
        res.json({ success: true, status: 200, message: 'MasterDish created successfully', masterDish });

        // return res.status(200).send(masterDish)

    } catch (error) {

        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}
const editMasterDish = async (req, res, next) => {
    try {


        const { masterDishId } = req.params;

        // Check if the master dish exists

        const existingMasterDish = await MasterDish.findByPk(masterDishId);
        if (!existingMasterDish) {
            return res.status(500).json({
                errorCode: ERROR_CODES.MASTERDISH_NOT_FOUND,
                message: 'Masterdish not found'

                // message: ERROR_MESSAGES.MASTERDISH_NOT_FOUND
            });
        }

        // Check if the new masterDishName is already taken by another master dish
        const unique = await MasterDish.findAll({
            where: {
                masterDishName: {
                    [Sequelize.Op.eq]: req.body.masterDishName
                },
                id: { [Sequelize.Op.not]: masterDishId } // Exclude the current dish being edited
            }
        });
        if (unique.length > 0) {
            return res.status(400).json({
                errorCode: ERROR_CODES.MASTERDISHNAME_UNIQUE,
                message: ERROR_MESSAGES.MASTERDISHNAME_UNIQUE
            });
        }

        let updatedMasterDishImage = existingMasterDish.masterDishImage;

        if (req.file) {
            const filePath = req.file.path;
            const fileBuffer = fs.readFileSync(filePath);
            const detectedFileType = await detectFileType(fileBuffer);

            if (!['JPEG image', 'JPG', 'PNG image', 'GIF image'].includes(detectedFileType)) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'Unsupported file format. Only JPEG, JPG, PNG, and GIF images are allowed.'
                });
            }

            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = path;
            fs.renameSync(path, newPath);
            updatedMasterDishImage = newPath;
        }

        // Update the master dish
        await existingMasterDish.update({
            masterDishName: req.body.masterDishName,
            masterDishImage: updatedMasterDishImage,
            updatedAt: new Date()
        });

        res.json({
            success: true,
            status: 200,
            message: 'MasterDish updated successfully',
            updatedMasterDish: existingMasterDish
        });
    } catch (error) {

        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
};

//GET MASTERDISH
const getMasterDish = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const perPage = parseInt(req.query.limit) || 5; // Default to 5 items per page if not provided
        const searchQuery = req.query.search || '';

        const offset = (page - 1) * perPage;

        const searchCondition = searchQuery
            ? {
                [Sequelize.Op.or]: [
                    { masterDishName: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    // Add more search fields as needed...
                ],
            }
            : {};

        const { count, rows: masterDish } = await MasterDish.findAndCountAll({
            where: {
                ...searchCondition,
                status: STATUS.ACTIVE,

            },
            offset,
            limit: perPage,
            order: [['createdAt', 'DESC']],

        });

        const totalPages = Math.ceil(count / perPage); // Calculate the total pages
        const currentPageDish = Math.min(perPage, count - offset);

        return res.status(200).send({
            totalItems: count,
            currentPage: page,
            itemsPerPage: perPage,
            totalPages: totalPages, // Include the total pages in the response
            masterDish: masterDish,
            currentPageDish: currentPageDish
        });
    } catch (error) {

        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR,
        }));
    }
};

//SHOP DELETE
const deleteMasterdish = async (req, res, next) => {
    try {
        const MasterDishes = await MasterDish.findOne({ where: { id: req.params?.id } })
        if (!MasterDishes) {
            return res.status(404).json({
                errorCode: ERROR_CODES.BAD_REQUEST,
                message: ERROR_MESSAGES.BAD_REQUEST
            })
        }
        else {
            await MasterDish.destroy({
                where: {
                    id: req.params.id
                },
            });
        }
        return res.status(200).json({ Message: " MasterDish deleted succesffuly" })
    } catch (error) {

        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }

}


//DATACOUNT
const dataCount = async (req, res, next) => {
    try {
        const shopCount = await Shop.count(
            {
                where: {
                    status: STATUS.ACTIVE
                }
            }
        ); // Use .count() to get the total count
        const userCount = await User.count({
            where: {
                userType: 1
            }
        });
        const ActiveUsers = await User.count({
            where: {
                userType: 1,
                status: STATUS.ACTIVE
            }
        });

        const totalOrders = await OrderHistory.count({
            where: {
                status: STATUS.ACTIVE,
                // bookedStatus: STATUSFIELD.orderStatus.FINISHED
            }
        })
        return res.status(200).json({ shopCount: shopCount, userCount: userCount, ActiveUsers: ActiveUsers, totalOrders: totalOrders }); // Sending the count as a JSON response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching table count.' });
    }
};


// GET USER
const getUsers = async (req, res, next) => {

    try {
        const users = await User.findAll({ where: { userType: Role.USER }, order: [['id', 'DESC']] })

        return res.status(200).send(users)
    } catch (error) {

        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}
// GET CURRENT USER dETAILS

const currentUser = async (req, res) => {

    try {
        const user = await User.findOne({
            where: {
                id: req.currentUserObj.userID
            },
            attributes: {
                exclude: ["password", "passwordToken", "deletedAt", "createdAt", "updatedAt",]
            }
        });

        res.status(200).json({ user });
    } catch (error) {

        res.status(500).json({ success: false, message: 'Error fetching shops' });
    }
};

// GET USER RANKWISE
const getUsersRankWise = async (req, res, next) => {

    try {
        let page = parseInt(req.query?.page) || 1;

        const limit = parseInt(req.query?.limit) || 5;

        let keyword = req.query?.searchkey || ""


        const users = await User.findAll({
            attributes: [
                'id',
                'email',
                'order_count',
                'userType',
                'userName',
                'registerType',
                'status',
                'createdAt',
                'updatedAt',
                [
                    Sequelize.literal('DENSE_RANK() OVER (ORDER BY order_count DESC)'),
                    'ranking',
                ],
                [
                    Sequelize.literal('(SELECT SUM(`point`.`point`) FROM `point` WHERE `point`.`userId` = `user`.`id`)'),
                    'totalPoints',
                ]
            ],
            include: [{
                model: Point,
                attributes: [],
            }],
            where: {
                // status: 0,
                user_type: 1,
                [Sequelize.Op.or]: [
                    { email: { [Sequelize.Op.like]: `%${escapeLike(keyword)}%` } },
                    { userName: { [Sequelize.Op.like]: `%${escapeLike(keyword)}%` } },
                ],
            },
            order: [
                ['order_count', 'DESC'],
            ],
            limit: limit,
            offset: (page - 1) * limit
        });
        const totalCount = await User.count({
            where: {
                // status: 1,
                user_type: 1,
                [Sequelize.Op.or]: [
                    { email: { [Sequelize.Op.like]: `%${escapeLike(keyword)}%` } },
                    { userName: { [Sequelize.Op.like]: `%${escapeLike(keyword)}%` } },
                ],
            },
        })

        return res.status(200).json({
            users,
            page: page,
            perPage: limit,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        })
    }
    catch (error) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }

}
function escapeLike(value) {
    return value.replace(/[!#%_]/g, (match) => `\\${match}`);
}

//ACTIVATE USER
const activateUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                errorCode: ERROR_CODES.USER_NOT_FOUND,
                message: ERROR_MESSAGES.USER_NOT_FOUND
            });
        }

        user.status = 1;
        await user.save();

        return res.status(200).json({ message: 'User activated successfully' });
    } catch (error) {

        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }));
    }
};

//DEACTIVATE USER
const deactivateUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                errorCode: ERROR_CODES.USER_NOT_FOUND,
                message: ERROR_MESSAGES.USER_NOT_FOUND
            });
        }

        user.status = 0;
        await user.save();

        return res.status(200).json({ message: 'User deactivated successfully' });
    } catch (error) {

        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }));
    }
};

//ADMIN ADD TABLETYPE
const addTableType = async (req, res, next) => {

    try {
        const tableType = await TableType.create({
            tableType: req.body.tableType,
            noOfSeats: req.body.noOfSeats,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()

        })
        return res.status(200).send(tableType)
    } catch (error) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

//ADMIN EDIT TABLETYPE
const updateTableType = async (req, res, next) => {

    try {
        const tableType = await TableType.findOne({ where: { id: req.params, status: STATUS.ACTIVE } })
        if (!tableType) {
            return next(res.status(500).json({
                errorCode: ERROR_CODES.TABLE_TYPE_NOT_FOUND,
                message: ERROR_MESSAGES.TABLE_TYPE_NOT_FOUND
            }))
        }
        tableType.tableType = req.body.tableType;
        tableType.noOfSeats = req.body.noOfSeats;
        await tableType.save();
        return res.status(200).send(tableType)
    } catch (error) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

//ADMIN DELETE TABLETYPE
const deleteTableType = async (req, res, next) => {

    try {
        const tableType = await TableType.findOne({ where: { id: req.params?.id, status: STATUS.ACTIVE } })

        if (!tableType) {

            return next(res.status(500).json({
                errorCode: ERROR_CODES.TABLE_TYPE_NOT_FOUND,
                message: ERROR_MESSAGES.TABLE_TYPE_NOT_FOUND
            }))
        }
        tableType.status = STATUS.INACTIVE;
        await tableType.save();
        return res.status(200).send(tableType)
    } catch (error) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

//ADMIN GET TABLETYPE
const getTableType = async (req, res, next) => {

    try {
        const tableType = await TableType.findAll({ where: { status: STATUS.ACTIVE } })
        return res.status(200).send(tableType)
    } catch (error) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

//USER REGISTER
const userRegister = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(res.status(400).send(errors.errors[0].msg))
    }

    try {
        const unique = await User.findAll({ where: { email: { [Sequelize.Op.eq]: req.body.email } } })
        if (unique.length > 0) {
            return res.status(400).json({
                errorCode: ERROR_CODES.EMAIL_ALREADY_EXIST,
                message: ERROR_MESSAGES.EMAIL_ALREADY_EXIST
            })
        }
        const reffer = req.body?.refferalCode;
        let userReffer;

        if (reffer) {
            const ReferralCodeExists = await User.findOne({ where: { refferalCode: reffer } });
            const match = reffer.match(/-(\d+)$/);

            userReffer = await User.findOne({ where: { id: match, status: STATUS.ACTIVE } })

            if (!ReferralCodeExists) {
                return res.status(400).json({
                    errorCode: ERROR_CODES.INVALID_REFERRAL_CODE,
                    message: ERROR_MESSAGES.INVALID_REFERRAL_CODE
                });
            }
            
           if (userReffer.refferalCode != reffer) {
                return res.status(400).json({
                    errorCode: ERROR_CODES.INVALID_REFERRAL_CODE,
                    message: ERROR_MESSAGES.INVALID_REFERRAL_CODE
                });
            }

            if (!userReffer) {
                return res.status(400).json({
                    errorCode: ERROR_CODES.USER_NOT_FOUND,
                    message: ERROR_MESSAGES.USER_NOT_FOUND
                })
            }
        }

        const password = req.body.password
        const hashedPassword = await bcrypt.hash(password, 8);


        const user = await User.create({
            email: req.body.email,
            userName: req.body.userName,
            registerType: registerType.NORMAL_REGISTER,
            password: hashedPassword,
            userType: Role.USER,
            registerBy: userReffer?.id,
            welcomeOffer: STATUSFIELD.welcomeOffer.CREDITED,
            status: STATUS.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date()

        })

        const refferalcode = `RES-${req.body.userName}-${user.id}`;

        await User.update({ refferalCode: refferalcode }, {
            where: {
                id: user.id,
            },
        });



        return res.status(200).json({ user, refferalcode })
    } catch (error) {
        console.log(error);
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}

// Listing trending shops

const getTrendingShops = async (req, res, next) => {
    try {
        let trendingShopArray = []
        let result = []
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(res.status(400).send(errors.errors[0].msg))
        }
        const trendingShops = await Shop.findAll({ where: { status: STATUS.ACTIVE, trending: 1 } })
        trendingShops.forEach(data => {
            trendingShopArray.push(data.id)
        });
        for (const id of trendingShopArray) {
            const orderCount = await OrderHistory.count({ where: { shopId: id } })
            const count = {
                shopId: id,
                count: orderCount
            }
            result.push(count)

        }

        /////////////////////////////////////




        let tables1 = trendingShops.map(a_element => {
            const matching_b = result.find(b_element => b_element["shopId"] === a_element["id"]);
            if (matching_b) {
                return { ...a_element, ...matching_b };
            }
            return a_element;
        });



        //////////////////////////
        return res.status(200).send(new GetTrndingShops(tables1))
    } catch (error) {

        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }

}

const getShopsMasterDish = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(res.status(400).send(errors.errors[0].msg))
        }
        if (req.body.shopId && req.body.masterdishId == undefined) {
            const trendingShopsMasterDish = await Dish.findAll({ where: { status: STATUS.ACTIVE, shopId: req.body.shopId } })
            return res.status(200).json({ trendingShopsMasterDish })
        }
        else {
            const trendingShopsDish = await Dish.findAll({ where: { status: STATUS.ACTIVE, shopId: req.body.shopId, masterdishId: req.body.masterdishId } })
            return res.status(200).json({ trendingShopsDish })
        }

    } catch (error) {
        return next(res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        }))
    }
}
const getMyOrders = async (req, res, next) => {
    const page = parseInt(req.body?.page) || 1;
    const perPage = parseInt(req.body?.limit) || null;
    try {
        const offset = (page - 1) * perPage;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.errors[0].msg });
        }


        const conditions = {}
        if (req.body.status) {
            conditions.bookedStatus = req.body?.status
        }
        if (req.body.bookedDate) {
            conditions.bookedDate = req.body?.bookedDate
        }


        const myOrders = await OrderHistory.findAll({
            where: {
                userId: req.currentUserObj.userID,
                ...conditions
            },
            offset,
            limit: perPage,
            include: [Shop, TimeSlot, ShopTable],
            order: [['bookedDate', 'DESC']]
        });

        const totalCount = await OrderHistory.count({
            where: {
                userId: req.currentUserObj.userID,
                ...conditions
            },
        });

        const ordersWithDishes = [];

        for (const order of myOrders) {
            const dishHistoryResults = await dishHistory.findAll({
                where: { orderHistoryId: order.id },
                include: [Dish]
            });
            ordersWithDishes.push({
                orderDetails: order,
                dishes: dishHistoryResults
            });
        }

        const orderHistoryView = new GetOrderHistoryView({ ordersWithDishes });
        const dataOnCurrentPage = Math.min(perPage, totalCount - offset);



        return res.status(200).json({
            orderHistoryView,
            page,
            perPage,
            totalCounts: totalCount,
            dataOnCurrentPage: dataOnCurrentPage,
            totalPages: Math.ceil(totalCount / perPage)
        });
    } catch (error) {
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
};
const orderCheckIn = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.errors[0].msg });
        }

        const CheckInData = await OrderHistory.findOne({
            where: {
                userId: req.currentUserObj.userID,
                id: req.params?.id
            },
            include: [TimeSlot]
        });

        if (CheckInData.bookedDate !== currentDate) {
            return res.status(400).json({
                errorCode: ERROR_CODES.BOOKED_DATE,
                message: ERROR_MESSAGES.BOOKED_DATE
            });
        }

        if (CheckInData.shop_timeslot.startTime != currentHour) {
            return res.status(400).json({
                errorCode: ERROR_CODES.NOT_IN_BOOKED_TIMESLOT,
                message: ERROR_MESSAGES.NOT_IN_BOOKED_TIMESLOT
            });
        }

        const [userPoints, created] = await Point.findOrCreate({
            where: {
                userId: req.currentUserObj.userID,
            },
            defaults: {
                point: 0,
            },
        });

        const initialPoints = userPoints.point;

        const updatedPoints = created ? 10 : userPoints.point + 10;

        await Point.update({ point: updatedPoints }, {
            where: {
                userId: req.currentUserObj.userID,
            },
        });

        const addedPoints = updatedPoints - initialPoints;

        const CheckedIn = {
            checkedStatus: STATUSFIELD.checkedStatus.checkedIn,
            bookedStatus: STATUSFIELD.orderStatus.ACCEPTED
        }

        await OrderHistory.update(CheckedIn, {
            where: {
                userId: req.currentUserObj.userID,
                id: req.params?.id
            },
        })

        const message = addedPoints > 0 && `You got ${addedPoints} points`;

        return res.status(200).json({ CheckInData, message: message, });
    }


    catch (error) {

        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

const orderCheckOut = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.errors[0].msg });
        }

        const CheckOutData = await OrderHistory.findOne({
            where: {
                userId: req.currentUserObj.userID,
                id: req.params?.id
            },
            include: [TimeSlot]
        });

        if (CheckOutData.checkedStatus != STATUSFIELD.checkedStatus.checkedIn) {
            return res.status(400).json({
                errorCode: ERROR_CODES.CHECKOUT_BEFORE_CHECKIN,
                message: ERROR_MESSAGES.CHECKOUT_BEFORE_CHECKIN
            });
        }

        const [userPoints, created] = await Point.findOrCreate({
            where: {
                userId: req.currentUserObj.userID,
            },
            defaults: {
                point: 0,
            },
        });

        const initialPoints = userPoints.point;
        let pointsToAdd = 0;



        if (CheckOutData.shop_timeslot.endTime > currentHour) {
            pointsToAdd = created ? 20 : userPoints.point + 20;
        } else {
            pointsToAdd = created ? 10 : userPoints.point + 10;
        }

        await Point.update({ point: pointsToAdd }, {
            where: {
                userId: req.currentUserObj.userID,
            },
        });

        const updatedPoints = pointsToAdd;
        const addedPoints = updatedPoints - initialPoints;


        const CheckedOut = {
            checkedStatus: STATUSFIELD.checkedStatus.Checkout,
            bookedStatus: STATUSFIELD.orderStatus.FINISHED
        }
        const booked = {
            bookedStatus: STATUSFIELD.tableStatus.AVAILABLE
        }

        await OrderHistory.update(CheckedOut, {
            where: {
                userId: req.currentUserObj.userID,
                id: req.params?.id
            },
        })

        await ShopTable.update(booked, {
            where: {
                id: CheckOutData.shopTableId
            }
        })

        return res.status(200).json({ CheckOutData, message: `You got ${addedPoints} points`, });
    }
    catch (error) {

        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

const top5Dishes = async (req, res, next) => {
    try {
        let dishArray = []
        let dishOrderCount
        let result = []
        const dishOrder = await dishHistory.findAll({ where: { status: STATUS.ACTIVE }, include: [Dish] })
        dishOrder.forEach(dish => {
            const x = {
                dishName: dish.dish.dishName,
                dishId: dish.dishId
            }
            dishArray.push(x)
        });
        // Use a Set to keep track of unique items
        const uniqueDishes = new Set();

        // Filter out duplicates based on dishId and dishName
        const filteredDishes = dishArray.filter(dish => {
            const key = dish.dishId + "-" + dish.dishName;
            if (!uniqueDishes.has(key)) {
                uniqueDishes.add(key);
                return true;
            }
            return false;
        });
        for (const id of filteredDishes) {
            dishOrderCount = await dishHistory.count({ where: { dishId: id.dishId } })
            const y = {
                dishName: id.dishName,
                dishId: id.dishId,
                count: dishOrderCount
            }
            result.push(y)
        }

        const sortedDishes = result.sort((a, b) => b.count - a.count);
        // Take only the top 2 elements
        const top2Dishes = sortedDishes.slice(0, 4);
        res.status(200).send(top2Dishes)
    } catch (error) {

        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR
        });
    }
}

const dishBookingHistory = async (req, res, next) => {
    try {

      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const perPage = parseInt(req.query.limit) || 5; // Default to 10 items per page if not provided
  
      const offset = (page - 1) * perPage;
  
      const dishBookingOrders = await dishHistory.findAndCountAll({
        where: {
          status: STATUS.ACTIVE,
        },
        include: [{model:OrderHistory,include:[{model:ShopOwners,attributes :['shopName']},{model:User,attributes: ['userName']}]},{model:Dish}],
        offset,
        limit: perPage,
        order: [['createdAt', 'DESC']],
      });
//   Extract shopIds from dishBookingOrders
const shopIds = dishBookingOrders.rows.map((order) => order.order_history.shopId);

// Fetch corresponding shops
const shops = await ShopOwners.findAll({
  where: {
    id: shopIds,
  },
  attributes:['shopName']
});

      const totalItems = dishBookingOrders.count;
      const totalPages = Math.ceil(totalItems / perPage); // Calculate the total pages
      const currentPageDishBookingOrders = dishBookingOrders.rows;
  
      return res.status(200).send({
        totalItems,
        currentPage: page,
        itemsPerPage: perPage,
        totalPages, // Include the total pages in the response
        dishBookingOrders: currentPageDishBookingOrders,
      });
   
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorCode: ERROR_CODES.UNEXPECTED_ERROR,
            message: ERROR_MESSAGES.UNEXPECTED_ERROR,
        });
    }
};




module.exports = { login, tokenRefresh, addShop, editShop, getShop, deleteShop, deleteMasterdish, dataCount, addMasterDish, editMasterDish, getUsersRankWise, getUsers, currentUser, activateUser, deactivateUser, userRegister, getMasterDish, getTableType, deleteTableType, updateTableType, addTableType, getShopsMasterDish, getTrendingShops, getMyOrders, orderCheckIn, orderCheckOut, top5Dishes, dishBookingHistory }
