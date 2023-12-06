const { checkSchema } = require('express-validator');

const tagValidators = {}

tagValidators.validateCreate = () => {
    return checkSchema({
        name: { notEmpty: true, isLength: { options: { max: 50 } } },
        //TODO Verification list
    })
}


module.exports = tagValidators;