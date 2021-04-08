const Joi = require('joi');

const applicationIdSchema = Joi.object({
    applicationId : Joi.number()
        .integer()
        .messages({
            'number.integer': `"applicationId" must be an integer`
          })
});

module.exports = applicationIdSchema;