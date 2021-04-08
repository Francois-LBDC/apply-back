const jwt = require('jsonwebtoken');


const authenticateToken = {
    verifyToken : (request, response, next) => {
        const authHeader = request.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            response.status(401).send('need connection');
        }
        else {
            jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => { 
                if (error) {
                    response.status(403).send('session expired');
                } else {
                request.user = user;
                next();
                }
            })
        }
    }
}

module.exports = authenticateToken;