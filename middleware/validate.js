const { body, validationResult } = require('express-validator');

//Validation rules for book collection
const bookValidationRules = () => {
    return [
        body('title')
            .notEmpty()
            .isString()
            .trim()
            .isIn(validMonths)
            .withMessage('Title is required.')
        //Need to fill in the rest
    ]
};

//Validation rules for patron collection

//Validation rules for location collection

//Validation rules for copy collection

//Validate function
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

//Export
module.exports = {
    bookValidationRules,
    validate
}