const AppConstants = {
    LIMIT_DEFAULT_VALUE: 20,
    OFFSET_DEFAULT_VALUE: 0,
    DB_URL: '127.0.0.1:27017/mydb',
    USERNAME_MIN_LENGTH: 4,
    USERNAME_MAX_LENGTH: 24,
    BODY_MIN_LENGTH: 5,
    BODY_MAX_LENGTH: 260,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 80,
    EMAIL_MIN_LENGTH: 5,
    EMAIL_MAX_LENGTH: 50,
    AGE_MIN_RANGE: 14,
    AGE_MAX_RANGE:101,
    NAME_MIN_LENGTH: 4,
    NAME_MAX_LENGTH: 50,

    EMAIL_REG_EXP:  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/,
    USERNAME_REG_EXP: /^[\w+_]{4,24}$/,
    PASSWORD_REG_EXP: /^[\w+_-]{6,20}$/,
    NAME_REG_EXP:    /^[a-zA-Z]+((['_.-][a-zA-Z ])?[a-zA-Z]*)$/,
    NUMBER_REG_EXP: /^[+-]?(([0-9])+([.][0-9]*)?|[.][0-9]+)$/,
    SYMBOL_REG_EXP: /^[!@#\$%\^\&*\)\(+=~._-]+$/,

}

module.exports = AppConstants;
