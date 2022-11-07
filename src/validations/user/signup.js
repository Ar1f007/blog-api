const Joi = require('joi');
const { validator, commonErrMsg } = require('../../utils');

const signupSchema = Joi.object({
  firstName: Joi.string()
    .required('')
    .min(3)
    .messages({
      'string.base': `First name should be a type of text`,
      ...commonErrMsg('first name', ['empty', 'min', 'required']),
    }),

  lastName: Joi.string()
    .required()
    .messages({
      'string.base': `Last name should be a type of text`,
      ...commonErrMsg('last name', ['empty', 'required']),
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Please provide a valid email',
      'string.email': 'Please provide a valid email',
      ...commonErrMsg('email', ['empty', 'required']),
    }),
  password: Joi.string()
    .min(5)
    .max(25)
    .required()
    .messages({
      'string.base': 'Password is required',
      ...commonErrMsg('password', ['empty', 'min', 'max', 'required']),
    }),
}).unknown(false);
const validateSignup = validator(signupSchema);

module.exports = validateSignup;

