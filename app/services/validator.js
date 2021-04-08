/**
 * validates a body with a chosen Joi schema
 * @param {Joi.schema} schema 
 * @returns {Function} Express middleware Express 
 */
const validateBody = (schema) => (request, response, next) => {
    const { error } = schema.validate(request.body, {"convert" :true});

    if (error) {
        response.status(400).json(error.message);
    } else {
        next();
    }
};

/**
 * validates a URL params with a chosen Joi schema
 * @param {Joi.schema} schema 
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => (request, response, next) => {
    const { error } = schema.validate(request.params);

    if (error) {
        response.status(400).json(error.message);
    } else {
        next();
    }
};

module.exports = {
    validateBody,
    validateParams
};