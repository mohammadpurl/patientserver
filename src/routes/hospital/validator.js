const { body, validationResult } = require('express-validator');


module.exports = new class {
    hospitalrValidation() {        
        return [
            body('name')
                .isLength({ min: 4 })
                .withMessage('name must be at least 4 chars long')
                .isLength({ max: 100 })
                .withMessage(' firstName must be less than 12 chars long')
                .exists()
                .withMessage('name is required')
                .trim()
                .matches(/^[A-Za-z0-9\_]+$/)
                .withMessage('firstName must be alphanumeric only')
                .escape()          
          
        ]

    }
        
}