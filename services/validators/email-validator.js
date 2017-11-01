const BaseValidator = require('./base');

class EmailValidator extends BaseValidator {
  isEmail(email){
  if(!email)
    return false;
  let emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
  if(emailRegExp.test(email))
    return false;
    return true;
}
}
module.exports = EmailValidator;
