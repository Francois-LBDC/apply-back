const Joi = require('joi');

const createApplicationSchema = Joi.object({
    company : Joi.string().allow('', null),
    cover_letter : Joi.string().allow('', null),
    type_id : Joi.number().integer().required()
        .valid(1,2,3)
        .messages({
            'any.required' : `Merci d'indiquer la catégorie de la candidature.`
        }),
    contract : Joi.number().integer().allow(''),
    title : Joi.string().trim().required()
        .messages({
            'any.required' : `Merci d'indiquer le titre de la candidature.`,
            'string.empty' : `Le titre de la candidature ne peut être vide.`
        }),
    link : Joi.string().allow('', null),
    location : Joi.string().allow('', null),
    notes : Joi.string().allow('', null),
    offer_content : Joi.string().allow('', null),
    status : Joi.number()
        .integer()
        .valid(0,1,3,4,5)
        .optional()
        .messages({
            'any.only': `Status must be 0, 1, 3, 4 or 5`
          }),
    date : Joi
            .when('status', { is: [1, 4, 5], then : Joi.date().max('now').required()})
            .when('status', { is: 3, then: Joi.date().required()})
            .when('status', { is: 0, then: Joi.any().optional()})
            .messages({
                'date.max' : `C'est un historique de vos actions: la date choisie pour la candidature, le refus ou la réponse positive ne peut être postérieure à aujourd'hui.`,
                'any.required' : `Vous devez ajouter la date du passage à cette étape`
                }),
    dateTitle : Joi.string(),
    dunning_date: Joi.date().allow('', null),
    applicationActions: Joi.array().items(
        Joi.object({
            actionDate : Joi.date()
            .when('actionType', { is: 2, then: Joi.date().max('now').required()})
            .messages({
                'date.max' : `C'est un historique de vos actions déjà effectuées: une relance ne peut être postérieure à aujourd'hui. (exception pour la date d'entretien)`
            }),
            actionTitle : Joi.string().trim()
            .messages({
                'string.empty' : `Le titre d'une action ne peut être vide.`
            }),
            actionType : Joi.number().integer().valid(2,3),
            actionIndex: Joi.number().integer()
        }))
}).unknown(true);

module.exports = createApplicationSchema;

