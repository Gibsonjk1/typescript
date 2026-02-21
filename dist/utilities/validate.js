"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validate = {
    userRules: () => {
        return [
            //username required rule
            (0, express_validator_1.body)("username")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 1 })
                .withMessage("Username is required."),
            //first name required rule
            (0, express_validator_1.body)("firstName")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 1 })
                .withMessage("first name is required."),
            //last name required rule
            (0, express_validator_1.body)("lastName")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2 })
                .withMessage("Please provide a last name."),
            // valid email is required and cannot already exist in the database
            (0, express_validator_1.body)("email")
                .trim()
                .escape()
                .notEmpty()
                .isEmail()
                .normalizeEmail() // refer to validator.js docs
                .withMessage("A valid email is required."),
            //password rules
            (0, express_validator_1.body)("password")
                .trim()
                .notEmpty()
                .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
                .withMessage("Password does not meet the Requirements."),
        ];
    },
    /* ******************************
     * Check data and return errors or continue to registration
     * ***************************** */
    checkUserData: async (req, res, next) => {
        const { username, firstName, lastName, email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
};
exports.default = validate;
