const { body } = require('express-validator');

// General validation for fields in the request body

function fieldValidator(fieldName,type, errorMessage) {
    let validation;
    switch (type) {
        case 'blank':
            validation=body(fieldName)
            .optional()
            .custom (
              value=> value.trim().length !==0? Promise.resolve():Promise.reject()
    
            )
            .withMessage(errorMessage);
            break;  
      case 'string':
        validation = body(fieldName)
        .optional()
          .isString()
          .withMessage(errorMessage);
        break;
      case 'number':
        validation = body(fieldName)
        .optional()  
        .isInt()
          .withMessage(errorMessage);
        break;
        case 'digit':
          validation=body(fieldName)
          .optional() 
          .custom(
            value => typeof value !=='number' ? Promise.reject() : Promise.resolve()
        )
        .withMessage(errorMessage);
        break;
        case 'null':
          validation = body(fieldName)
          .optional()
          .notEmpty()
          .withMessage(errorMessage);
          break;
      default:
        validation = body(fieldName).exists().withMessage(errorMessage);
        break;
    }
    return validation;
  }
  

  // Size validation for the fields in request body

  function sizeValidator(fieldName,min,max,type,errorMessage) {
    let validation;
    switch (type) {
        case 'length':
            validation=body(fieldName)
            .optional()
            .isLength({
            min:min,
            max:max
           })
           .withMessage(errorMessage);
           break;
        case 'size':
            validation=body(fieldName)
            .optional()
            .custom(value=>{
                let val=parseInt(value)
            if(val<min||val>max){
                return Promise.reject()
            }    
            else{
                return Promise.resolve()
            }
            })
            .withMessage(errorMessage);
        break;
      default:
        validation = body(fieldName).exists().withMessage(errorMessage);
        break;
    }
    return validation;
  }

  function customValidator(fieldName,type,errorMessage){
    let  validation=body(fieldName).optional()
    if(type==='blank'){
            validation
        
            .custom(value=>{
                if(value.length===0){
                    return Promise.resolve()
                }
                if(value.trim().length===0){
                    return Promise.reject(errorMessage)
                }
                else{
                    return Promise.resolve()
                }
            })
    }
    else {
      validation.isInt().withMessage(errorMessage)
    }
            
    return validation
  }

  function dateValidator(fieldName,type,errorMessage){
    
    
    let validation=body(fieldName).optional()
    if(type==='dateFormat'){
      validation.isDate()
      .withMessage(errorMessage)
    }
    else{
    validation
    .custom(value => {
      let date2 = new Date(value)
      let date1 = new Date()
      if (date2.getTime() > date1.getTime()) {
          return Promise.resolve()
      }
      else {
          return Promise.reject()
      }

  })
  .withMessage(errorMessage)
}
return validation
}

function updatephoneNumberValidator(fieldName,errorMessage){
  
  return body(fieldName)
  .optional()
  .custom(value=>{
    let phoneRegex=  /^(|\d+)$/
    if(phoneRegex.test(value)){

        return Promise.resolve()
    }
    else{
        return Promise.reject(errorMessage)
    }
})
}

  function customSizeValidator(fieldName,min,max,type,errorMessage){
    let  validation=body(fieldName).optional()
     if(type==='length'){
          validation
          .custom(value=>{
              if(value.length===0){
                  return Promise.resolve()
              }
              else if(value.length>=min && value.length<=max){
                  return Promise.resolve()
              }
              else{
                  return Promise.reject(errorMessage)
              }
          })
     }
     else{
            validation
            .custom(value=>{
              if(value.length===0){
                return Promise.resolve()
            }
               else if(value<min || value>max){
                    return Promise.reject(errorMessage)
                }
                else{
                    return Promise.resolve()
                }
            })
     }
     return validation
}

// Validation for email format
function validateEmailFormat1(fieldName,errorMessage){
return body(fieldName)
  .optional()
  .custom(value=>{
    let emailRegex=  /^(|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)$/
    if(emailRegex.test(value)){

        return Promise.resolve()
    }
    else{
        return Promise.reject(errorMessage)
    }
})
}      
  
function dateValidation(fieldName,errorMessage){
  
return body(fieldName)
.optional()
.custom(value=>{
let dateRegex=  /^(|\d{4}[-/]\d{2}[-/]\d{2})$/
if(dateRegex.test(value)){

    return Promise.resolve()
}
else{
    return Promise.reject(errorMessage)
}
})
}

  module.exports={fieldValidator,sizeValidator,customValidator,customSizeValidator,dateValidator,updatephoneNumberValidator,validateEmailFormat1,dateValidation}
