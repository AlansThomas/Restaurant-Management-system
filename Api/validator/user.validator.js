const { body } = require('express-validator');
const user = require('../models/user.model');
const ERROR_CODES = require('../utils/errorCodes.utils');
const ERROR_MESSAGES = require('../utils/errorMessages.utils');
const { fieldValidator,sizeValidator }=require('./updateField.validator')
const { validateField,sizeValidation,validateEmailFormat,passwordValidator } = require('./field.validator');


exports.userRegister=[
    validateField('userName','required',{
        errorCode:ERROR_CODES.USERNAME_REQUIRED,
        message:ERROR_MESSAGES.USERNAME_REQUIRED
    }),
    validateField('userName','null',{
        errorCode:ERROR_CODES.USERNAME_REQUIRED,
        message:ERROR_MESSAGES.USERNAME_REQUIRED
    }),
    validateField('userName','string',{
        errorCode:ERROR_CODES.USERNAME_ACCEPTS_ONLY_STRING,
        message:ERROR_MESSAGES.USERNAME_ACCEPTS_ONLY_STRING
    }),
    validateField('userName','blank',{
        errorCode:ERROR_CODES.USERNAME_BLANK,
        message:ERROR_MESSAGES.USERNAME_BLANK
    }),
    sizeValidation('userName',1,30,'length',{
        errorCode:ERROR_CODES.USERNAME_LENGTH,
        message:ERROR_MESSAGES.USERNAME_LENGTH
    }),
    validateField('email','required',{
        errorCode:ERROR_CODES.EMAIL_REQUIRED,
        message:ERROR_MESSAGES.EMAIL_REQUIRED
    }),
    validateField('email','null',{
        errorCode:ERROR_CODES.EMAIL_REQUIRED,
        message:ERROR_MESSAGES.EMAIL_REQUIRED
    }),
    validateField('email','string',{
        errorCode:ERROR_CODES.EMAIL_ACCEPTS_ONLY_STRING,
        message:ERROR_MESSAGES.EMAIL_ACCEPTS_ONLY_STRING
    }),
    validateField('email','blank',{
        errorCode:ERROR_CODES.EMAIL_BLANK,
        message:ERROR_MESSAGES.EMAIL_BLANK
    }),
    validateEmailFormat('email',{
        errorCode:ERROR_CODES.INVALID_EMAIL_FORMAT,
        message:ERROR_MESSAGES.INVALID_EMAIL_FORMAT
    }),
    sizeValidation('email',1,30,{
        errorCode:ERROR_CODES.EMAIL_LENGTH,
        message:ERROR_MESSAGES.EMAIL_LENGTH
    }),
    
    validateField('password','required',{
        errorCode:ERROR_CODES.PASSWORD_REQUIRED,
        message:ERROR_MESSAGES.PASSWORD_REQUIRED
    }),
    validateField('password','null',{
         errorCode:ERROR_CODES.PASSWORD_REQUIRED,
        message:ERROR_MESSAGES.PASSWORD_REQUIRED
    }),
    validateField('password','string',{
        errorCode:ERROR_CODES.PASSWORD_ACCEPTS_ONLY_STRING,
        message:ERROR_MESSAGES.PASSWORD_ACCEPTS_ONLY_STRING
    }),
    validateField('password','blank',{
        errorCode:ERROR_CODES.PASSWORD_BLANK,
        message:ERROR_MESSAGES.PASSWORD_BLANK
    }),
    passwordValidator('password',{
        errorCode:ERROR_CODES.INVALID_PASSWORD_PATTERN,
        message:ERROR_MESSAGES.INVALID_PASSWORD_PATTERN
    }),
]
