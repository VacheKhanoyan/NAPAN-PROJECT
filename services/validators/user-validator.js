const BaseValidator = require('./base');

const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');

class UserValidator extends BaseValidator {
    constructor() {
        super();
    }

    validateUsername(username, sanitize) {
                if (!username) {
            return Utility.ErrorTypes.USERNAME_PASS_MISSING;
        }
        if (username.length < AppConstants.USERNAME_MIN_LENGTH
            || username.length > AppConstants.USERNAME_MAX_LENGTH)
        {
            return Utility.ErrorTypes.INVALID_USERNAME_RANGE;
        }
            return Utility.ErrorTypes.SUCCESS;
    }

    validatePassword(pass, sanitize) {

    }

}
module.exports = new UserValidator();
