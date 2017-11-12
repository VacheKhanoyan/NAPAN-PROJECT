const AppConstants = require('./../settings/constants');

const ErrorTypes = {
  SUCCESS: 'success',
  VALIDATION_ERROR: 'validation_error',
  USERNAME_MISSING: 'username_missing',
  PASS_MISSING: 'password_missing',
  INVALID_USERNAME_RANGE: 'invalid_username_range',
  INVALID_PASSWORD_RANGE: 'invalid_password_range',
  INVALID_AGE_RANGE: 'invalid_age_range',
  USER_CREATION_ERROR: 'user_creation_error',
  PERMISSION_DENIED: 'permission_denied',
  UNKNOWN_ERROR: 'unknown_error',
  USER_ID_ERROR: 'id_not_found',
  USER_DELETE_ERROR: 'deleting_error',
  USER_UPDATE_ERROR: 'updating_error',
  POST_CREATION_ERROR: 'post error',
  BODY_SIZE_ERROR: 'invalid post size',
  EMPTY_PHOTO: 'no photo',
  PHOTO_TYPE_ERROR: 'type error',
  PHOTO_DELETE_ERROR: ' delete error',
};

class Utility {
  static parseQuery(req, res, next) {
    req.query.offset = parseInt(req.query.offset);
    if (!isFinite(req.query.offset)) {
      req.query.offset = AppConstants.OFFSET_DEFAULT_VALUE;
    }

    req.query.limit = parseInt(req.query.limit);
    if (!isFinite(req.query.limit)) {
      req.query.limit = AppConstants.LIMIT_DEFAULT_VALUE;
    }
    next();
  }
  static generateErrorMessage(type, options) {
    options = options || {};
    let error_object = {
      type: type || ErrorTypes.UNKNOWN_ERROR,
      message: 'Something went wrong..'
    };
    switch (type) {
      case ErrorTypes.USERNAME_MISSING:
      error_object.message = 'Username  is not specified.';
      break;
      case ErrorTypes.PASS_MISSING:
      error_object.message = 'password is not specified.';
      break;
      case ErrorTypes.INVALID_USERNAME_RANGE:
      error_object.message = 'Invalid min/max value for username, must be >= {min} and <= {max}, your value is: {val}'.replace('{min}', AppConstants.USERNAME_MIN_LENGTH)
      .replace('{max}', AppConstants.USERNAME_MAX_LENGTH);
      break;
      case ErrorTypes.INVALID_PASSWORD_RANGE:
      error_object.message = 'Invalid min/max value for password, must be ...'; // TODO:
      break;
      case ErrorTypes.INVALID_PASSWORD_RANGE:
      error_object.message = 'please add correct age';
      break;
      case ErrorTypes.USER_CREATION_ERROR:
      error_object.message = 'Failed to create a user.';
      break;
      case ErrorTypes.USER_ID_ERROR:
      error_object.message = 'this id didn`t found.';
      break;
      case ErrorTypes.USER_DELETE_ERROR:
      error_object.message = 'this user didn`t removed.';
      break;
      case ErrorTypes.USER_UPDATE_ERROR:
      error_object.message = 'didn`t update.';
      break;
      case ErrorTypes.PERMISSION_DENIED:
      error_object.message = 'you must be registered.';
      break;
      case ErrorTypes.POST_CREATION_ERROR:
      error_object.message = 'posting error, please try again.';
      break;
      case ErrorTypes.BODY_SIZE_ERROR:
      error_object.message = 'posting size error.';
      break;
      case ErrorTypes.EMPTY_PHOTO:
      error_object.message = 'photo is empty';
      case ErrorTypes.PHOTO_TYPE_ERROR:
      error_object.message = 'wrong photos type';
      case ErrorTypes.PHOTO_DELETE_ERROR:
      error_object.message = 'dont delete, please try again';
    }
    return error_object;
  }
}
module.exports = Utility;
module.exports.ErrorTypes = ErrorTypes;
