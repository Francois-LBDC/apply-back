const Joi = require('joi');

const signupSchema = Joi.object({
    firstname : Joi.string()
        .required()
        .messages({
        'string.base': `firstname should be a text`,
        'string.empty': `firstname cannot be an empty field`,
        'any.required': `firstname is a required field`
      }),
    lastname : Joi.string()
        .required()
        .messages({
            'string.base': `lastname should be a text`,
            'string.empty': `lastname cannot be an empty field`,
            'any.required': `lastname is a required field`
          }),
    email : Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': `invalid email form`,
            'string.empty': `email cannot be an empty field`,
            'any.required': `email is a required field`
          }),
    password : Joi.string()
        .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,30}$/))
        .required()
        .messages({
            'string.pattern.base': `Password must be min 8 and max 30 characters long, with at least one lowercase letter, one uppercase latter and one number`,
            'string.empty': `password cannot be an empty field`,
            'any.required': `password is a required field`
          }),
    passwordConfirm : Joi.ref('password')
});

module.exports = signupSchema;