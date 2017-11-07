const BaseValidator = require('./base');

const AgeValidator = require('./age-validator');
const EmailValidator = require('./email-validator');
const NameValidator = require('./name-validator');
const PasswordValidator = require('./password-validator');
const UsernameValidator = require('./username-validator');

const Utility = require('./../utility');
const AppConstants = require('./../../settings/constants');

class UserValidator extends BaseValidator {
  constructor() {
    super();
  }

  validateUsername(username, sanitize) {

    if (!username) {

      return Utility.ErrorTypes.USERNAME_MISSING;
    }
    if (username.length < AppConstants.USERNAME_MIN_LENGTH
      || username.length > AppConstants.USERNAME_MAX_LENGTH)
      {
        return Utility.ErrorTypes.INVALID_USERNAME_RANGE;
      }
      return UsernameValidator.validate(username);
      // TODO:
      /*
      if (sanitize) {
      _sanitizeUsername(username);
    }
    */
  }

  validatePassword(password, sanitize) {
    if (!password) {
      return Utility.ErrorTypes.PASSWORD_MISSING;
    }
    if (password.length < AppConstants.PASSWORD_MIN_LENGTH
      || password.length > AppConstants.PASSWORD_MAX_LENGTH)
      {
        return Utility.ErrorTypes.INVALID_PASSWORD_RANGE;
      }
      return PasswordValidator.validate(password);
    }
    validateName(name) {
      return NameValidator.validate(name);
    }
    validateAge (age) {
      return AgeValidator.validate(age);
    }
    validateEmail (email) {
      return EmailValidator.validate(email);
    }
  }

  module.exports = new UserValidator();
