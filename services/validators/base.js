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
      if(!str || typeof(str) !== 'string')
        return false ;
        return true;
    }

    _isNumber(str) {
      if(!num)
    return false;
  let numberRegExp = /^[+-]?(([0-9])+([.][0-9]*)?|[.][0-9]+)$/;
  if(numberRegExp.test(num))
    return true;
    return false;
    }
}

module.exports = BaseValidator;
module.exports.Types = Types;
