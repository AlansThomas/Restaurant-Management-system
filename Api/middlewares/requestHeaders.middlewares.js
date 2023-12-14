const ERROR_CODES=require('../utils/errorCode.utils');
const ERROR_MESSAGES=require('../utils/errorMessages.utils')

const contentType = (req, res, next) => {
  if(req.headers["content-type"]){
  if (req.headers["content-type"] === "application/json"){
     next();
   }
   else{
     return res
       .status(400)
       .json({
        errorCode:ERROR_CODES.IMPROPER_CONTENT_TYPE,
        message: ERROR_MESSAGES.IMPROPER_CONTENT_TYPE
      });
      }
    }
    else{
      return res
      .status(400)
      .json({ 
        errorCode:ERROR_CODES.HEADER_MISSING,
        message: ERROR_MESSAGES.HEADER_MISSING 
       });
    }
  };

const multipart = (req, res, next) => {
  if(req.headers["content-type"]){
  if (req.headers["content-type"].startsWith ('multipart/form-data')){
    if(req.headers["content-type"]===("multipart/form-data"||"multipart/form-data;")){
      return next(res.status(400).json({
        errorCode:ERROR_CODES.IMPROPER_CONTENT_TYPE,
        message: ERROR_MESSAGES.IMPROPER_CONTENT_TYPE}))
    }
    else{
     next();
    }
   }else{
    return next(res.status(400).json({
      errorCode:ERROR_CODES.IMPROPER_CONTENT_TYPE,
      message: ERROR_MESSAGES.IMPROPER_CONTENT_TYPE}))
   }
  }
   else{
     return next(res
       .status(400)
       .json({ 
        errorCode:ERROR_CODES.HEADER_MISSING,
        message: ERROR_MESSAGES.HEADER_MISSING  }));
   }
      };

  
 const headers={};
 headers.app_json=contentType;
 headers.multipart=multipart;
 
 module.exports = headers;