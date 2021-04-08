const User = require('../models/user');

// JWT
const jwt = require('jsonwebtoken');
//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {
    connectUser : async (request, response) => {
        try {
        const checkUser = await User.findOne(request.body.email);
        if (!!checkUser.email) {
            const match = await bcrypt.compare(request.body.password, checkUser.password);
            // case where body.password and encrypted password match
            if (match) {
                const accessToken = jwt.sign({
                    firstname: checkUser.firstname,
                    lastname: checkUser.lastname,
                    email: checkUser.email,
                    id: checkUser.id
                }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
               
                const user = {
                    accessToken: accessToken,
                    firstname: checkUser.firstname,
                    lastname: checkUser.lastname,
                    email: checkUser.email
                }
                
                response.json(user);
            }
            //case where the passwords don't match
            else {
                response.status(403).json('Wrong email or password');
            }
            //case where the email does not exist in the database
        } else {
            response.status(403).json('Wrong email or password');
        }
        } catch(error) {
            console.trace(error);
        }
    },

    createUser : async (request, response) => {
            try {
                // try to find a user with this email
                const checkUser = await User.findOne(request.body.email);
                //if there is no other user with this email we can bcrypt the password and save it in the database
                if (!checkUser.email) {
                    const hashed = await bcrypt.hash(request.body.password, saltRounds);
                    const data = {
                        firstname : request.body.firstname, 
                        lastname : request.body.lastname, 
                        email : request.body.email, 
                        password : hashed
                    };
                    const newUser = new User(data);
                    await newUser.save(newUser);

                    // emmit a token to login user on signup completion
                    const accessToken = jwt.sign({
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email,
                        id: newUser.id
                    }, process.env.TOKEN_SECRET, { expiresIn: '6h' });
                   
                    const user = {
                        accessToken: accessToken,
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        email: newUser.email
                    }
                    
                    response.status(201).json(user);
                // if this email is already used
                } else {
                    response.status(403).json('Email already exists.');
                }
            }catch (error) {
                console.trace(error)
            }
    }
}

module.exports = userController;