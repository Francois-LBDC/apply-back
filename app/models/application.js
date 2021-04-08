const db = require('../database')

class Application {
    id;
    creation_date;
    title;
    link;
    offer_content;
    dunning_date;
    notes;
    location;
    type_id;
    company_id;
    contract_id;
    cover_letter_id;
    user_id;


    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    //allows you to get all applications + actions from a user

    /**
     * Returns all the applications of a user thanks to its id. The latest action of each application is also added
     * @param {number} userId - The id of the connected user
     */
    static async findAll(userId) {
        const { rows } = await db.query(/*`
        SELECT 
            application.id, application.creation_date, application.location, application.title, TO_CHAR(application.dunning_date, 'DD/MM/YYYY') AS dunning_date, 
			company.name AS company,
            contract.name AS contract,
			action_type.name AS last_action_type,
            COALESCE(TO_CHAR(action.date, 'DD/MM/YYYY'),'Pas d''action enregistrée') AS last_action_date,
            action.title AS last_action_title
        FROM application
        LEFT JOIN action ON (action.application_id = application.id AND action.date = (SELECT MAX("date") FROM action WHERE action.application_id = application.id))
        LEFT JOIN action_type ON action.action_type_id = action_type.id
        LEFT JOIN company ON (application.company_id IS NOT NULL AND application.company_id = company.id)
        LEFT JOIN contract ON (application.contract_id IS NOT NULL AND application.contract_id = contract.id)
        WHERE user_id=$1;`, 
        [userId]);*/

        `
        SELECT 
            application.id, application.creation_date, application.location, application.title, TO_CHAR(application.dunning_date, 'DD/MM/YYYY') AS dunning_date, 
			company.name AS company,
            contract.name AS contract,
			action_type.name AS last_action_type,
            COALESCE(TO_CHAR(action.date, 'DD/MM/YYYY'),'Pas d''action enregistrée') AS last_action_date,
            action.title AS last_action_title
        FROM application
        LEFT JOIN action ON 
			action.id = (SELECT DISTINCT ON (application_id) action.id FROM action WHERE action.application_id = application.id
			ORDER BY action.application_id, action.date DESC , action.action_type_id DESC)
        LEFT JOIN action_type ON action.action_type_id = action_type.id
        LEFT JOIN company ON (application.company_id IS NOT NULL AND application.company_id = company.id)
        LEFT JOIN contract ON (application.contract_id IS NOT NULL AND application.contract_id = contract.id)
        WHERE user_id=$1;`,
        [userId]);
		
        

        return rows.map(entry => new Application(entry));
    }

   /**
     * Returns one application thanks to its id and user id, with all information attached (apart from actions)
     * @param {number} userId - The id of the connected user
     * @param {number} applicationId - The id of the application
     */
    static async findOne(userId, applicationId) {
    const { rows } = await db.query(`
    SELECT 
        application.id, application.title, application.link, application.offer_content, application.notes, application.location, application.cover_letter_id,
        TO_CHAR(application.dunning_date, 'DD/MM/YYYY') AS dunning_date, TO_CHAR(application.dunning_date, 'YYYY-MM-DD') as dunning_date_format, application.type_id,
        company.name AS company,
        type.name AS type, application.type_id,
        contract.name AS contract, application.contract_id,
        cover_letter.content AS cover_letter_content
    FROM application
        LEFT JOIN company ON (application.company_id IS NOT NULL AND application.company_id = company.id)
        LEFT JOIN contract ON (application.contract_id IS NOT NULL AND application.contract_id = contract.id)
        LEFT JOIN cover_letter ON application.cover_letter_id = cover_letter.id
        LEFT JOIN type ON application.type_id = type.id
    WHERE user_id=$1 AND application.id = $2;
    `, 
    [userId, applicationId])

    return new Application(rows[0]);
    }


    //Static method to modify the notes of a given application
    static async modifyNotes(userId, applicationId, notes) {
        const { rows } = await db.query(`
        UPDATE application 
        SET 
            notes = $3
        WHERE 
            user_id=$1 AND id = $2
        RETURNING notes;
    `, 
    [userId, applicationId, notes])

    return new Application(rows[0]);
    }


    //Static method to modify the notes of a given application
    static async modifyOfferContent(userId, applicationId, offer_content) {
        const { rows } = await db.query(`
        UPDATE application 
        SET 
            offer_content = $3
        WHERE 
            user_id=$1 AND id = $2
        RETURNING offer_content;
    `, 
    [userId, applicationId, offer_content])

    return new Application(rows[0]);
    }

    static async modifyTitle(userId, applicationId, title) {
        const { rows } = await db.query(`
        UPDATE application 
        SET 
            title = $3
        WHERE 
            user_id=$1 AND id = $2
        RETURNING title;
    `, 
    [userId, applicationId, title])

    return new Application(rows[0]);
    }

    static async modifyInfo(userId, applicationId, data, company_id) {
        const { rows } = await db.query(`
        UPDATE application 
        SET 
            type_id = $3 , 
            contract_id = $4, 
            link = $5, 
            location = $6, 
            dunning_date = $7,
            company_id = $8
        WHERE 
            user_id=$1 AND id = $2
        RETURNING type_id, contract_id, title, link, location, dunning_date;
    `, 
    [userId, applicationId, data.type_id , data.contract_id, data.link, data.location, data.dunning_date_format, company_id])

    return new Application(rows[0]);
    }

    static async modifyCoverLetterId(userId, applicationId, data) {
        const { rows } = await db.query(`
        UPDATE application 
        SET 
            cover_letter_id = $3 
        WHERE 
            user_id=$1 AND id = $2
        RETURNING cover_letter_id;
    `, 
    [userId, applicationId, data.cover_letter_id])

    return new Application(rows[0]);
    } 
    

    async save(newApplication) {
        const { rows } = await db.query(`
        INSERT INTO application
            (title, 
            link, 
            offer_content,
            dunning_date,
            notes, 
            "location", 
            type_id,
            company_id,
            contract_id,
            cover_letter_id,
            user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;`, 
            [newApplication.title, 
            newApplication.link, 
            newApplication.offer_content, 
            newApplication.dunning_date,
            newApplication.notes,
            newApplication.location,
            newApplication.type_id,
            newApplication.company_id,
            newApplication.contract_id,
            newApplication.cover_letter_id,
            newApplication.user_id,
            ]);
        this.id = rows[0].id;
    }



}

module.exports = Application;