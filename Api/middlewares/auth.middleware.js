require("dotenv").config();
const bcrypt=require('bcryptjs');
const User=require('../models/user.model')

const jwt=require('jsonwebtoken')
const ROLE=require('../utils/role.utils')
// const STATUS=require('../utils/status.utils')

const ERROR_CODES=require('../utils/errorCodes.utils')
const ERROR_MESSAGES=require('../utils/errorMessages.utils')
const Shop=require('../models/shopowners.model')



// Setting up authguard for user side
const userAuthguard = async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.AUTH_HEADER_MISSING,
          message: ERROR_MESSAGES.AUTH_HEADER_MISSING
        }));
      }
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.user_type !== ROLE.USER) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
          message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
        }));
      }
      const user = await User.findOne({
        where: {
          id: decoded.id,
          status:1
        }
      });
      if (!user) {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.INVALID_TOKEN,
          message:ERROR_MESSAGES.INVALID_TOKEN
        }));
      }
      req.user = decoded;
      const validPassword = await bcrypt.compare(decoded.password, user.password);
      if (!validPassword) {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.INVALID_TOKEN,
          message:ERROR_MESSAGES.INVALID_TOKEN
        }));
      }
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.TOKEN_EXPIRED,
          message:ERROR_MESSAGES.TOKEN_EXPIRED
        }));
      }
      return next(res.status(401).json({
        errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
        message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
      }));
    }
  };

  // Setting up authguard for user side
const adminAuthguard = async (req, res, next) => {
  try {
   
    const token = req.headers['authorization'];
    if (!token) {
      return next(res.status(401).json({
        errorCode: ERROR_CODES.AUTH_HEADER_MISSING,
        message: ERROR_MESSAGES.AUTH_HEADER_MISSING
      }));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.id,
        status:1
      }
    });
    if (!user) {
      return next(res.status(401).json({
        errorCode:ERROR_CODES.INVALID_TOKEN,
        message:ERROR_MESSAGES.INVALID_TOKEN
      }));
    }
    
    if (user.userType != ROLE.ADMIN) {
      return next(res.status(401).json({
        errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
        message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
      }));
    }
    
    req.user = decoded;
    const validPassword = await bcrypt.compare(decoded.password, user.password);
    if (!validPassword) {
      return next(res.status(401).json({
        errorCode:ERROR_CODES.INVALID_TOKEN,
        message:ERROR_MESSAGES.INVALID_TOKEN
      }));
    }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(res.status(401).json({
        errorCode:ERROR_CODES.TOKEN_EXPIRED,
        message:ERROR_MESSAGES.TOKEN_EXPIRED
      }));
    }
    return next(res.status(401).json({
      errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
      message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
    }));
  }
};

  // Setting up authguard for user side
  const shopAuthguard = async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.AUTH_HEADER_MISSING,
          message: ERROR_MESSAGES.AUTH_HEADER_MISSING
        }));
      }
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.user_type !== ROLE.ADMIN) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
          message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
        }));
      }
      const shop = await Shop.findOne({
        where: {
          id: decoded.id,
          status:1
        }
      });
      if (!shop) {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.INVALID_TOKEN,
          message:ERROR_MESSAGES.INVALID_TOKEN
        }));
      }
      req.shop = decoded;
      const validPassword = await bcrypt.compare(decoded.password, user.password);
      if (!validPassword) {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.INVALID_TOKEN,
          message:ERROR_MESSAGES.INVALID_TOKEN
        }));
      }
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(res.status(401).json({
          errorCode:ERROR_CODES.TOKEN_EXPIRED,
          message:ERROR_MESSAGES.TOKEN_EXPIRED
        }));
      }
      return next(res.status(401).json({
        errorCode: ERROR_CODES.UNAUTHORISED_ACCESS,
        message: ERROR_MESSAGES.UNAUTHORISED_ACCESS
      }));
    }
  };


  module.exports={userAuthguard,adminAuthguard,shopAuthguard}