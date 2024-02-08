const { checkSchema } = require('express-validator');

const taskValidators = {}

taskValidators.validateCreate = () => {
    return checkSchema({
        title: { notEmpty: true, isLength: { options: { max: 50 } } },
        description: { optional: true, notEmpty: false, isLength: { options: { min: 1, max: 200 } } },
        important_fixed: { optional: true, isBoolean: true },
        state: { optional: true, isIn: { options: [[1, 2, 3, 4]] } }, //Revisar
        context_id: {optional: true, isInt: { min: 0 } },
        project_id: {optional: true, isInt: { min: 0 } },
        date_limit: {optional: true, isISO8601: true},
        //TODO Verification list
    })
}


taskValidators.validateModify = () => {
    return checkSchema({
        title: { optional: true, notEmpty: true, isLength: { options: { max: 50 } } },
        description: { optional: true, notEmpty: false, isLength: { options: { min: 1, max: 200 } } },
        important_fixed: { optional: true, isBoolean: true },
        state: { optional: true, isIn: { options: [[1, 2, 3, 4]] } }, //Revisar
        context_id: {optional: true, isInt: { min: 0 } },
        project_id: {optional: true, isInt: { min: 0 } },
        date_limit: {optional: true, isISO8601: true},
        completed: {optional: true, isBoolean: true},
        //TODO Verification list
    })
}

module.exports = taskValidators;