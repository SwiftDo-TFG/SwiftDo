const { body } = require('express-validator');

const taskValidators = {}


taskValidators.validateCreate = () => {
    return checkSchema({
        title: { notEmpty: true, isLength: { options: { max: 50 } } },
        description: { isLength: { options: { min: 1, max: 200 } } },
        important_fixed: { isBoolean: true },
        state: { isIn: { options: [1, 2, 3, 4] } }, //Revisar
        context_id: {isInt: { min: 0 } },
        project_id: {isInt: { min: 0 } },
        date_limit: {isDate: true},
        //TODO Verification list
    })
}

module.exports = taskValidators;