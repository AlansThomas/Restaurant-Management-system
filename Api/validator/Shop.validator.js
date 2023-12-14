const { body, query ,param,check} = require('express-validator')
const ERROR_CODES=require('../utils/errorCodes.utils');
const ERROR_MESSAGES=require('../utils/errorMessages.utils')
// const { validationResult,check } = require('express-validator');

const addShopValidator = [
    check('email')
        .isEmail().withMessage('Invalid email format'),

        check('phoneNumber')
        .matches(/^\d+$/)
        .withMessage({ message: 'Phone number must contain only numbers', errorCode: 112 })
        .isLength({ min: 10, max: 12 })
        .withMessage({ message: 'Phone number must be between 10 and 12 characters long', errorCode: 111 }),
    check('shopName')
        .isLength({ max: 25 }).withMessage('Shop Name must be at most 25 characters long')
        .custom(value => !/\s{2,}/.test(value)).withMessage('Shop Name can only have one space'),
    check('address')
        .isLength({ max: 50 }).withMessage('Shop Address must be at most 50 characters long')
        .custom(value => !/\s{2,}/.test(value)).withMessage('Shop address can only have one space'),
    check('startTime')
        .isInt({ min: 1, max: 24 }).withMessage('Start time must be between 1 and 24'),
    check('endTime')
        .isInt({ min: 1, max: 24 }).withMessage('End time must be between 1 and 24'),
];


module.exports = { addShopValidator }