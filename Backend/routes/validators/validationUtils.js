const { validationResult } = require('express-validator');

module.exports = function checkValidations (req, res, next) {
    const result = validationResult(req);
  
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }
  
    next()
}