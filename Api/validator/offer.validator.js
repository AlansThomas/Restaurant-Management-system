const { body } = require('express-validator');
const Offer = require('../models/offer.model');
const shoptimeslot = require('../models/shoptimeslot.model');
const ERROR_CODES = require('../utils/errorCodes.utils');
const ERROR_MESSAGES = require('../utils/errorMessages.utils');
const { fieldValidator,sizeValidator }=require('./updateField.validator')
const { validateField,sizeValidation } = require('./field.validator');

exports.addOffers=[

validateField('offerName','required',{
    errorCode:ERROR_CODES.OFFER_NAME_REQUIRED,
    message:ERROR_MESSAGES.OFFER_NAME_REQUIRED
}),
validateField('offerName','null',{
    errorCode:ERROR_CODES.OFFER_NAME_REQUIRED,
    message:ERROR_MESSAGES.OFFER_NAME_REQUIRED
}),
validateField('offerName','string',{
    errorCode:ERROR_CODES.OFFER_NAME_ACCEPTS_ONLY_STRING,
    message:ERROR_MESSAGES.OFFER_NAME_ACCEPTS_ONLY_STRING
}),
validateField('offerName','blank',{
    errorCode:ERROR_CODES.OFFER_NAME_BLANK,
    message:ERROR_MESSAGES.OFFER_NAME_BLANK
}),
sizeValidation('offerName',1,150,'length',{
    errorCode:ERROR_CODES.OFFER_NAME_LENGTH,
    message:ERROR_MESSAGES.OFFER_NAME_LENGTH
}),
validateField('description','required',{
    errorCode:ERROR_CODES.DESCRIPTION_REQUIRED,
    message:ERROR_MESSAGES.DESCRIPTION_REQUIRED
}),
validateField('description','null',{
    errorCode:ERROR_CODES.DESCRIPTION_REQUIRED,
    message:ERROR_MESSAGES.DESCRIPTION_REQUIRED
}),
validateField('description','string',{
    errorCode:ERROR_CODES.DESCRIPTION_ACCEPTS_ONLY_STRING,
    message:ERROR_MESSAGES.DESCRIPTION_ACCEPTS_ONLY_STRING
}),
validateField('description','blank',{
    errorCode:ERROR_CODES.DESCRIPTION_BLANK,
    message:ERROR_MESSAGES.DESCRIPTION_BLANK
}),
sizeValidation('description',1,250,'length',{
    errorCode:ERROR_CODES.DESCRIPTION_LENGTH,
    message:ERROR_MESSAGES.DESCRIPTION_LENGTH
}),

body('startDate')
        .isDate()
        .withMessage({
            errorCode: ERROR_CODES.INVALID_DATE_FORMAT,
            message: ERROR_MESSAGES.INVALID_DATE_FORMAT
        })
        .custom(value => {
            let date2 = new Date(value)
            let date1 = new Date()
            if (date2.getTime()<date1.getTime()) {
                return Promise.reject()
            }
            else {
                return Promise.resolve()
            }

        })
        .withMessage({
            errorCode: ERROR_CODES.START_DATE_LESS_THAN_CURRENT,
            message: ERROR_MESSAGES.START_DATE_LESS_THAN_CURRENT
        }),

        body('endDate')
        .isDate()
        .withMessage({
            errorCode: ERROR_CODES.INVALID_DATE_FORMAT,
            message: ERROR_MESSAGES.INVALID_DATE_FORMAT
        })
        .custom((value ,{req})=> {
            let date2 = new Date(req.body.startDate)
            let date1 = new Date(value)
            if (date2.getTime()>date1.getTime()) {
                return Promise.reject()
            }
            else {
                return Promise.resolve()
            }

        })
        .withMessage({
            errorCode: ERROR_CODES.END_DATE_GREATER_THAN_START_DATE,
            message: ERROR_MESSAGES.END_DATE_GREATER_THAN_START_DATE
        }),
]

exports.updateOffers = [

    fieldValidator('offerName','required',{
        errorCode:ERROR_CODES.OFFER_NAME_REQUIRED,
        message:ERROR_MESSAGES.OFFER_NAME_REQUIRED
    }),
    fieldValidator('offerName','null',{
        errorCode:ERROR_CODES.OFFER_NAME_REQUIRED,
        message:ERROR_MESSAGES.OFFER_NAME_REQUIRED
    }),
    fieldValidator('offerName','string',{
        errorCode:ERROR_CODES.OFFER_NAME_ACCEPTS_ONLY_STRING,
        message:ERROR_MESSAGES.OFFER_NAME_ACCEPTS_ONLY_STRING
    }),
    fieldValidator('offerName','blank',{
        errorCode:ERROR_CODES.OFFER_NAME_BLANK,
        message:ERROR_MESSAGES.OFFER_NAME_BLANK
    }),
    sizeValidator('offerName',1,150,'length',{
        errorCode:ERROR_CODES.OFFER_NAME_LENGTH,
        message:ERROR_MESSAGES.OFFER_NAME_LENGTH
    }),
    
    fieldValidator('description','required',{
        errorCode:ERROR_CODES.DESCRIPTION_REQUIRED,
        message:ERROR_MESSAGES.DESCRIPTION_REQUIRED
    }),
    fieldValidator('description','null',{
        errorCode:ERROR_CODES.DESCRIPTION_REQUIRED,
        message:ERROR_MESSAGES.DESCRIPTION_REQUIRED
    }),
    fieldValidator('description','string',{
        errorCode:ERROR_CODES.DESCRIPTION_ACCEPTS_ONLY_STRING,
        message:ERROR_MESSAGES.DESCRIPTION_ACCEPTS_ONLY_STRING
    }),
    fieldValidator('description','blank',{
        errorCode:ERROR_CODES.DESCRIPTION_BLANK,
        message:ERROR_MESSAGES.DESCRIPTION_BLANK
    }),
    sizeValidator('description',1,150,'length',{
        errorCode:ERROR_CODES.DESCRIPTION_LENGTH,
        message:ERROR_MESSAGES.DESCRIPTION_LENGTH
    }),
    
    body('startDate')
            .isDate()
            .withMessage({
                errorCode: ERROR_CODES.INVALID_DATE_FORMAT,
                message: ERROR_MESSAGES.INVALID_DATE_FORMAT
            })
            .custom(value => {
                let date2 = new Date(value)
                let date1 = new Date()
                if (date2.getTime()<date1.getTime()) {
                    return Promise.reject()
                }
                else {
                    return Promise.resolve()
                }
    
            })
            .withMessage({
                errorCode: ERROR_CODES.START_DATE_LESS_THAN_CURRENT,
                message: ERROR_MESSAGES.START_DATE_LESS_THAN_CURRENT
            }),
    
            body('endDate')
            .isDate()
            .withMessage({
                errorCode: ERROR_CODES.INVALID_DATE_FORMAT,
                message: ERROR_MESSAGES.INVALID_DATE_FORMAT
            })
            .custom((value ,{req})=> {
                let date2 = new Date(req.body.startDate)
                let date1 = new Date(value)
                if (date2.getTime()>date1.getTime()) {
                    return Promise.reject()
                }
                else {
                    return Promise.resolve()
                }
    
            })
            .withMessage({
                errorCode: ERROR_CODES.END_DATE_GREATER_THAN_START_DATE,
                message: ERROR_MESSAGES.END_DATE_GREATER_THAN_START_DATE
            }),
]
