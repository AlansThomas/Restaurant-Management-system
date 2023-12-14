const { body } = require('express-validator');
const ERROR_CODES = require('../utils/errorCodes.utils');
const ERROR_MESSAGES = require('../utils/errorMessages.utils');
const { fieldValidator,sizeValidator }=require('./updateField.validator')
const { validateField,sizeValidation } = require('./field.validator');

exports.timeSlotValidator=[
    validateField('startTime','required',{
        errorCode:ERROR_CODES.START_TIME_REQUIRED,
        message:ERROR_MESSAGES.START_TIME_REQUIRED
    }),
    validateField('startTime','null',{
        errorCode:ERROR_CODES.START_TIME_REQUIRED,
        message:ERROR_MESSAGES.START_TIME_REQUIRED
    }),
    validateField('startTime','blank',{
        errorCode:ERROR_CODES.START_TIME_BLANK,
        message:ERROR_MESSAGES.START_TIME_BLANK
    }),
    validateField('startTime','number',{
       
      errorCode:ERROR_CODES.START_TIME_NUMBER,
      message:ERROR_MESSAGES.START_TIME_NUMBER 
  }),
    sizeValidation('startTime',0,23,'size',{
      
        errorCode:ERROR_CODES.START_TIME_LIMIT,
        message:ERROR_MESSAGES.START_TIME_LIMIT
    }),

    body('startTime')
    .custom((value ,{req})=> {
        if (value>req.body.endTime) {
            return Promise.reject()
        }
        else {
            return Promise.resolve()
        }

    })
    .withMessage({
     
        errorCode: ERROR_CODES.END_TIME_GREATER_THAN_START_TIME,
        message: ERROR_MESSAGES.END_TIME_GREATER_THAN_START_TIME
    }),

    

    validateField('endTime','required',{
        errorCode:ERROR_CODES.END_TIME_REQUIRED,
        message:ERROR_MESSAGES.END_TIME_REQUIRED
    }),
    validateField('endTime','null',{
        errorCode:ERROR_CODES.END_TIME_REQUIRED,
        message:ERROR_MESSAGES.END_TIME_REQUIRED
    }),
    validateField('endTime','blank',{
        errorCode:ERROR_CODES.END_TIME_BLANK,
        message:ERROR_MESSAGES.END_TIME_BLANK 
    }),
    validateField('endTime','number',{
    
        errorCode:ERROR_CODES.END_TIME_NUMBER,
        message:ERROR_MESSAGES.END_TIME_NUMBER 
    }),
    sizeValidation('endTime',0,23,'size',{

        errorCode:ERROR_CODES.END_TIME_LIMIT,
        message:ERROR_MESSAGES.END_TIME_LIMIT
    }),

]