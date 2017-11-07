const BaseValidator = require('./base');
const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');

class nameValidator extends BaseValidator
{
    constructor()
    {
        super();
    }
    validate (name)
    {
        if(!super.validator(name, BaseValidator.Types.STRING)) {
            return Utility.ErrorTypes.INVALID_TYPE
        }
        let nameRegExp = AppConstants.NAME_REG_EXP;
        if(nameRegExp.test(name))
            return Utility.ErrorTypes.SUCCESS;
        return Utility.ErrorTypes.INVALID_NAME;
    }
}

module.exports = new nameValidator();
