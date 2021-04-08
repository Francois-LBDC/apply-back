const Joi = require('joi');

const loginSchema = Joi.object({
    email : Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': `invalid email form`,
            'string.empty': `email cannot be an empty field`,
            'any.required': `email is a required field`
          }),
    password : Joi.string()
    //  .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,30}$/))
        .required(),
});

module.exports = loginSchema;