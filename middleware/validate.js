const { body, validationResult } = require('express-validator');

const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
const validGenres = ['Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Science Fiction', 
                     'Fantasy', 'Biography', 'History', 'Romance', 'Horror'];

const bookValidationRules = () => {
    return [
        body('title').notEmpty().withMessage('Title is required'),
        body('author').notEmpty().withMessage('Author is required'),
        body('isbn').notEmpty().withMessage('ISBN is required'),
        body('publicationYear').isInt({ min: 1000, max: new Date().getFullYear() })
            .withMessage('Publication year must be a valid year'),
        body('genre').isIn(validGenres).withMessage('Invalid genre'),
        body('copiesAvailable').isInt({ min: 0 }).withMessage('Copies available must be a non-negative integer'),
        body('publicationMonth').optional().isIn(validMonths).withMessage('Invalid month')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(422).json({ errors: extractedErrors });
};

module.exports = { bookValidationRules, validate };