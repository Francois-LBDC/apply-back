const db = require('../database')

class CoverLetter {
    id;
    content;
    creation_date;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }


    //Créer une meilleure recherche ? 
    // find one cover_letter with id
    static async findOne(cover_letter_id) {
        const { rows } = await db.query(`
        SELECT * 
        FROM cover_letter
        WHERE name=$1;`, 
        [cover_letter_id]);
        return new CoverLetter(rows[0]);
    }

    static async modifyCoverLetter(userId, applicationId, coverLetterContent) {
        const { rows } = await db.query(`
        UPDATE cover_letter
            SET content = $3
        FROM application
            WHERE 
            application.cover_letter_id = cover_letter.id 
            AND application.id = $2
            AND application.user_id = $1
        RETURNING cover_letter.content;
    `, 
    [userId, applicationId, coverLetterContent])

    return new CoverLetter(rows[0]);
    }

    static async deleteOne(cover_letter_id) {
        const { rows } = await db.query(`
        DELETE FROM cover_letter
        WHERE id=$1;`, 
        [cover_letter_id]);
        return new CoverLetter(rows[0]);
    }


    async save(newCoverLetter) {
        const { rows } = await db.query(`
        INSERT INTO cover_letter (content) 
        VALUES ($1)
        RETURNING id;`, 
        [newCoverLetter.content]);
        this.id = rows[0].id;
    }

}

module.exports = CoverLetter;