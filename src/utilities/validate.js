const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


validate.userRules = () => {
    return [
        //username required rule
    body("username")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 1 })
  .withMessage("Username is required."),
        //first name required rule
    body("firstName")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 1 })
  .withMessage("first name is required."),
        //last name required rule
    body("lastName")
    .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 2 })
  .withMessage("Please provide a last name."),
// valid email is required and cannot already exist in the database
body("email")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required."),
        //password rules
    body("password")
  .trim()
  .notEmpty()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage(
    "Password does not meet the Requirements."
  ),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUserData = async (req, res, next) => {
  const { username, firstName, lastName, email, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(400).json({ errors: errors.array()})
  }
  next()
}
module.exports = validate