const db = require('../database')

class Company {
    id;
    name;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }


    //Créer une meilleure recherche ? 
    // find one company thanks to name
    static async findWithName(company_name) {
        const { rows } = await db.query(`
        SELECT * 
        FROM company
        WHERE name=$1;`, 
        [company_name]);
        return new Company(rows[0]);
    }


    async save(newCompany) {
        const { rows } = await db.query(`
        INSERT INTO company (name) 
        VALUES ($1)
        RETURNING id, name;`, 
        [newCompany.name]);
        this.id = rows[0].id;
    }

}

module.exports = Company;