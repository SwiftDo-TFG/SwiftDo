const { checkSchema } = require('express-validator');

const projectValidators = {}

projectValidators.validateCreate = () => {
    return checkSchema({
        title:{ optional: false, isLength: { options: { max: 20 } } }, 
        description:{optional: true, isLength: {options: {min: 1, max: 200} } } 
    })
}

projectValidators.validateModify = () => {
    return checkSchema({
        title:{ optional: false, isLength: { options: { max: 20 } } }, 
        description:{optional: true, isLength: {options: {min: 1, max: 200} } } 
    })
}

module.exports = projectValidators;