const Types = {
    STRING: 'string',
    NUMBER: 'number'
};

class BaseValidator {

    constructor() {
        this.handlers = {};
        this.handlers[Types.STRING] = this._isString;
        this.handlers[Types.NUMBER] = this._isNumber;
    }

    validate(str, type) {
        if (!this.handlers[type]) {
            return false;
        }
        return this.handlers[type](str);
    }
    _isString(str) {
      if(!str || typeof(str) !== "string"){
        return false;
      }
      return true;
    }
    _isInteger(str) {
     if(!num || (num ^ 0) !== num) {
       return false;
     }
     return true;
    }
    _isDate(str){
      if(!d)
      return false;
      if(Date.parse(d))
      return true;
      return false;
    }
    _isNumber(str){
     if(!num){
     return false;
    }
     let numReg = AppConstants.NUMBER_REG_EXP;
     if(numReg.test(num))
     return true;
     return false;
    }
    _isSpecialSymbol(str){
      if(!str)
      return false;
      let symReg = AppConstants.SYMB_REG;
      if(symReg.test(str))
      return true;
      return false;
    }
    _isUsersSYmbValid(str){
      if(str)
      return false;
      let UsSymb = AppConstants.USER_SYMB_VALID;
      if(UsSymb.test(str))
      return true;
      return false;
    }
}

module.exports = BaseValidator;
module.exports.Types = Types;
