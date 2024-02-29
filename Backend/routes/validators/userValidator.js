const { checkSchema } = require('express-validator');

const userValidators = {}

userValidators.validateLogin = () => {
    return checkSchema({
        email: { notEmpty: true}, //isEmail: true 
        password: { notEmpty: true }, // isLength: { options: { min: 8 }
    })
}

userValidators.validateRegister = () => {
    return checkSchema({
        name: { notEmpty: true, isLength: { options: { max: 30 } } },
        email: { notEmpty: true, isEmail: true },
        password: { notEmpty: true }, //notEmpty: true,
    })
}

module.exports = userValidators;