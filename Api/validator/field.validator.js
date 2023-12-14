const { body,query } = require('express-validator')

function validateField(fieldName,type, errorMessage) {
    let validation;
    switch (type) {
        case 'blank':
            validation=body(fieldName)
            .custom (
              value=> value.trim().length !==0? Promise.resolve():Promise.reject()
    
            )
            .withMessage(errorMessage);
            break;    
      case 'string':
        validation = body(fieldName)
          .isString()
          .withMessage(errorMessage);
        break;
      case 'number':
        validation = body(fieldName)
          .isInt()
          .withMessage(errorMessage);
        break;
        case 'digit':
          validation=body(fieldName)
           .custom(
            value => typeof value !=='number' ? Promise.reject() : Promise.resolve()
        )
        .withMessage(errorMessage);
        break;
        case 'null':
          validation = body(fieldName)
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

  function sizeValidation(fieldName,min,max,type,errorMessage) {
    let validation;
    switch (type) {
        case 'length':
            validation=body(fieldName)
           .isLength({
            min:min,
            max:max
           })
           .withMessage(errorMessage);
           break;
        case 'size':
            validation=body(fieldName)
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

  // Validation for password field

  function passwordValidator(fieldName,errorMessage){
    return body(fieldName)
        .custom(value=>{
          let passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,12}$/
          if(!passwordRegex.test(value)){
              return Promise.reject()
          }
          else{
              return Promise.resolve()
          }
      })
      .withMessage(errorMessage);
  }

  function passwordComparison(fieldName,compareWord,errorMessage){
    return body(fieldName)
    .custom(value=>{
      if(value===compareWord){
        return Promise.resolve()
      }
      else{
        return Promise.reject();
      }
    })
    .withMessage(errorMessage)
    
  }

  function phoneNumberValidator(fieldName,errorMessage){
    
    return body(fieldName)
    .custom(value=>{
      let phoneRegex=/^\d+$/
      if(phoneRegex.test(value)){
          return Promise.resolve()
      }
      else{
          return Promise.reject(errorMessage)
      }
  })
}


// Validation for email format
function validateEmailFormat(fieldName,errorMessage){
return body(fieldName)
    .isEmail()
    .withMessage(errorMessage)
}

function sortByValidator(argsArray,errorMessage){
return query('sortBy').optional().isIn(argsArray).withMessage(errorMessage)
}

  module.exports={validateField,sizeValidation,passwordValidator,validateEmailFormat,passwordComparison,phoneNumberValidator,sortByValidator}