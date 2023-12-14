const { body, query, param } = require('express-validator')

const ERROR_CODES = require('../utils/errorCodes.utils');
const ERROR_MESSAGES = require('../utils/errorMessages.utils')

const dishValidator = (validationType) => {
    switch (validationType) {
        case 'addDish':
            return [
                body('masterdishId')
                    .notEmpty()
                    .withMessage({
                        errorCode: ERROR_CODES.MASTERDISHID_IS_REQUIRED,
                        message: ERROR_MESSAGES.MASTERDISHID_IS_REQUIRED
                    })
                    .isInt()
                    .withMessage({
                        errorCode: ERROR_CODES.MUST_BE_INTEGER,
                        message: ERROR_MESSAGES.MUST_BE_INTEGER
                    }),

                body('dishName')
                    .notEmpty()
                    .withMessage({
                        errorCode: ERROR_CODES.DISHNAME_IS_REQUIRED,
                        message: ERROR_MESSAGES.DISHNAME_IS_REQUIRED
                    })
                    .isString({ max: 30 })
                    .withMessage({
                        errorCode: ERROR_CODES.DISHNAME_MUST_BE_STRING,
                        message: ERROR_MESSAGES.DISHNAME_MUST_BE_STRING
                    }),
                body('phone_number')
                    .optional()
                    .isInt({ min: 0, max: 2 })
                    .withMessage({
                        errorCode: ERROR_CODES.VIEW_EMPLOYER_STATUS_VALUE,
                        message: ERROR_MESSAGES.VIEW_EMPLOYER_STATUS_VALUE
                    }),
                body('shop_name')
                    .optional()
                    .isIn(['Asc', 'Desc'])
                    .withMessage({
                        errorCode: ERROR_CODES.ORDERBY_VALUE,
                        message: ERROR_MESSAGES.ORDERBY_VALUE
                    })
            ]
        case 'updateShop':
    }
}

module.exports = { dishValidator }



