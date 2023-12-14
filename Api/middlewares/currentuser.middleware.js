require("dotenv").config();
const bcrypt=require('bcryptjs');
const User=require('../models/user.model')
const Shop=require('../models/shopowners.model')

const jwt=require('jsonwebtoken')
const ROLE=require('../utils/role.utils')
const STATUS=require('../utils/status.util')

const ERROR_CODES=require('../utils/errorCodes.utils')
const ERROR_MESSAGES=require('../utils/errorMessages.utils')

const currentUser = async (req, res, next) => {
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
              status:STATUS.ACTIVE
            }
          });
          if (!user) {
            return next(res.status(401).json({
              errorCode:ERROR_CODES.INVALID_TOKEN,
              message:ERROR_MESSAGES.INVALID_TOKEN
            }));
          }
          const currentUserObj = {
            userID: user.id,
            email:user.email,
            userType:user.userType,
            userName:user.userName,
            registerType:user.registerType,
            profileImage:user.profileImage,
            orderCount:user.orderCount,
            status:user.status,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
          };
          req.currentUserObj= currentUserObj;       
        
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

}


const currentShop = async (req, res, next) => {
  try {
      const token = req.headers['authorization'];
      if (!token) {
        return next(res.status(401).json({
          errorCode: ERROR_CODES.AUTH_HEADER_MISSING,
          message: ERROR_MESSAGES.AUTH_HEADER_MISSING
        }));
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      

      const shop = await Shop.findOne({
          where: {
            id: decoded.id,
            status:STATUS.ACTIVE
          }
        });
        if (!shop) {
          return next(res.status(401).json({
            errorCode:ERROR_CODES.INVALID_TOKEN,
            message:ERROR_MESSAGES.INVALID_TOKEN
          }));
        }
        const currentShopObj = {
          shopID: shop.id,
          email: shop.email,
          shopName:shop.shopName,
          phoneNumber:shop.phoneNumber,
          shopImage:shop.shopImage,
          address:shop.address,
          startTime:shop.startTime,
          endTime:shop.endTime,
          shopStatus:shop.shopStatus,
          trending:shop.trending,
          status:shop.status,
          createdAt:shop.createdAt,
          updatedAt:shop.updatedAt
        };
        req.currentShopObj= currentShopObj;   
  
      
        const validPassword = await bcrypt.compare(decoded.password, shop.password);
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

}

module.exports={currentUser,currentShop}