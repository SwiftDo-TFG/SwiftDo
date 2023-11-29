const { checkSchema } = require('express-validator');

const userValidators = {}

userValidators.validateLogin = () => {
    return checkSchema({
        email: { isEmail: true },
        password: { isLength: { options: { min: 8 } } },
    })
}

module.exports = userValidators;