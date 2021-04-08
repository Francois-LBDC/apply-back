const db = require('../database')

class User {
    id;
    firstname;
    lastname;
    email;
    password;

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    // find one user thanks to email
    static async findOne(email) {
        const { rows } = await db.query(`
        SELECT * 
        FROM "user"
        WHERE email=$1;`, 
        [email]);
        return new User(rows[0]);
    }


    async save(newUser) {
        const { rows } = await db.query(`
        INSERT INTO "user" (firstname, lastname, email, password) 
        VALUES ($1, $2, $3, $4)
        RETURNING id;`, 
        [newUser.firstname, newUser.lastname, newUser.email, newUser.password]);
        this.id = rows[0].id;
    }

}

module.exports = User;