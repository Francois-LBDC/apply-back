const Joi = require('joi');

const modifyApplicationSchema = Joi.object({
    application : Joi.object().keys({
        title : Joi.string().trim().required().allow(null)
            .messages({
            'string.base' : `Le titre de la candidature doit contenir des lettres.`,
            'string.empty' : `Le titre de la candidature ne peut être vide.`
        }),
        link : Joi.string().trim().allow('', null)
            .messages({
            'string.base' : `Le lien indiqué n'est pas valide (le lien doit être vide ou bien contenir des lettres).`,
        }),
        offer_content : Joi.string().trim().allow('', null),
        dunning_date: Joi.string().allow('', null),
        dunning_date_format: Joi.date().allow('', null),
        notes : Joi.string().trim().allow('', null),
        location : Joi.string().trim().allow('', null),
        cover_letter_id : Joi.number().integer().allow(null),
        company : Joi.string().trim().allow('', null),
        contract_id : Joi.number().integer().allow(null),
        type_id : Joi.number().integer().allow(null),
        cover_letter_content : Joi.string().trim().allow('', null),
    })
    .unknown(true),

    actions: Joi.array().items(
        Joi.object({
            id : Joi.number().integer().allow(null),
            date : Joi.any().allow(null),
            title : Joi.string().trim().required()
            .messages({
                'string.empty' : `Le titre d'une des actions modifiées de votre historique est vide, merci d'indiquer un titre.`,
                'any.required' : `Merci d'indiquer un titre à chacune de vos actions.`
            }),
            action_type_id : Joi.number().integer().required(),
            date_format: Joi.date().required()
                .when('action_type_id', { is: [1,2,4,5,6], then: Joi.date().max('now').required()})
            .messages({
                'date.max' : `C'est un historique de vos actions: la date modifiée pour une candidature, un refus, une réponse positive ou un abandon ne peut être postérieure à aujourd'hui.`,
                'any.required' : `Vous devez indiquer une date pour toutes les actions modifiées.`
            }),
            toDelete : Joi.boolean().required()
        })
        .unknown(true)
    ),

    newActions: Joi.array().items(
        Joi.object({
            id : Joi.number().integer(),
            title : Joi.string().trim().required()
            .messages({
                'string.empty' : `Le titre d'une des actions ajoutée est vide, merci d'indiquer un titre.`,
                'any.required' : `Merci d'indiquer un titre à chacune de vos actions.`
            }),
            action_type_id : Joi.number().integer().required(),
            date_format: Joi.date().required()
                .when('action_type_id', { is: [1,2,4,5,6], then: Joi.date().max('now').required()})
            .messages({
                'date.max' : `C'est un historique de vos actions: la date modifiée pour une candidature, un refus, une réponse positive ou un abandon ne peut être postérieure à aujourd'hui.`,
                'any.required' : `Vous devez indiquer une date pour toutes les actions modifiées.`
            }),
            toDelete : Joi.boolean().required()
        })
        .unknown(true)
    )
}).unknown(true)

module.exports = modifyApplicationSchema;