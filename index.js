require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express(); 

const port = process.env.PORT || 7000;

//cors parameters
/*app.use(cors({
    origin : ['http://learned-fuel.surge.sh/', 'http://localhost:8080'],
    methods : "GET, PUT, PATCH, POST, DELETE",
    allowedHeaders : ['Content-Type', 'authorization'],
}));
*/
//app.options('*', cors());

app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
    methods: "GET, PUT, PATCH, POST, DELETE",
    allowedHeaders : ['Content-Type', 'Authorization'],

}));

app.use((request, response, next) => {
    const allowedOrigins = ['http://learned-fuel.surge.sh/', 'http://localhost:8080/'];
    const origin = request.headers.origin;
    if (allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
   }
    //response.header("Access-Control-Allow-Origin", "http://localhost:8080")
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, authorization")
    response.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    response.header('Access-Control-Allow-Credentials', true);
    next();
});


const Router = require('./app/router');

app.use(express.json());

app.use(Router);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

/*{
    origin : 'http://localhost:7002',
    methods : ['PUT', 'PATCH', 'POST']
} */

/*
//cors parameters
app.use(cors());
app.options('*', cors());
*/