const Types = {
  STRING: 'string',
  NUMBER: 'number',
  DATE: 'date'
};

class BaseValidator {

  constructor() {
    this.handlers = {};
    this.handlers[Types.STRING] = this._isString;
    this.handlers[Types.NUMBER] = this._isNumber;
    //this.hendlers[Types.DATE] = this._isDate;
  }

  validate(str, type) {
    if (!this.handlers[type]) {
      return false;
    }
    return this.handlers[type](str);
  }
  _isString(str) {
    if(!str)
    return false;
    return(typeof(str) === "string")
  }

  _isDate(str){
    if(!str){
      return false;
    }
    return Date.parse(str);
  }
  _isNumber(str){
    if(!str){
      return false;
    }
    let numRegExp = AppConstants.NUMBER_REG_EXP;
    return numRegExp.test(str);
  }
  _isSymbol(str){
    if(!str)
    return false;
    let symRegExp = AppConstants.SYMBOL_REG_EXP;
    return symRegExp.test(str);
  }
}

module.exports = BaseValidator;
module.exports.Types = Types;
