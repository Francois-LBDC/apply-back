const db = require('../database')

class Action {
    id;
    title;
    "date";
    action_type_id;
    application_id;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    /*
    static async findAllActionsOfApplication(applicationId) {
        const { rows } = await db.query(`
        SELECT 
            action.id, action.title, action.action_type_id,
            action_type.name AS action_type,
            (CASE 
                WHEN action_type.id=3 THEN TO_CHAR(action.date, 'DD/MM/YYYY HH:MI')
                ELSE TO_CHAR(action.date, 'DD/MM/YYYY')
            END) AS "date" 
        FROM action
        JOIN action_type ON action.action_type_id = action_type.id
        WHERE action.application_id=$1
        ORDER BY action.date ASC;`, 
        [applicationId]);

        return rows.map(entry => new Action(entry));
    }
    */

   static async findAllActionsOfApplication(applicationId) {
    const { rows } = await db.query(`
    SELECT 
        action.id, action.title, action.action_type_id,
        action_type.name AS action_type,
        TO_CHAR(action.date, 'DD/MM/YYYY') AS date,
        TO_CHAR(action.date, 'YYYY-MM-DD') AS date_format
    FROM action
    JOIN action_type ON action.action_type_id = action_type.id
    WHERE action.application_id=$1
    ORDER BY action.date ASC;`, 
    [applicationId]);

    return rows.map(entry => new Action(entry));
}

    async modifyAction(data) {
        const { rows } = await db.query(`
        UPDATE action
        SET 
            title = $1, 
            "date" = $2, 
            action_type_id = $3
        WHERE 
            id = $4;
    `, 
    [data.title.trim(), data.date_format, data.action_type_id, data.id])

    return new Action(rows[0]);
    }


    async deleteAction(userId, applicationId, action) {
        const { rows } = await db.query(`
        DELETE FROM "action"
        USING application
        WHERE 
            action.id = $3 
            AND application.id = action.application_id 
            AND application.user_id = $1
            AND action.application_id = $2;
    `, 
    [userId, applicationId, action.id])
    }

    async save(newAction) {
        const { rows } = await db.query(`
        INSERT INTO "action" (title, "date", action_type_id, application_id) 
        VALUES ($1, $2, $3, $4)
        RETURNING title;`, 
        [newAction.title, newAction.date, newAction.action_type_id, newAction.application_id]);
        this.id = rows[0].id;
    }
}

module.exports = Action;