require('dotenv').config();
require('./config/mongo');
const express = require('express');
const cors = require('cors');
const app = express();
const notFound = require('./middleware/notFound');

const {
    PORT,
    FRONTEND_DOMAIN_URL
} = process.env;

// Middleware
const corsOptions = {
    origin: FRONTEND_DOMAIN_URL,
    exposedHeaders: 'Authorization',
    credentials: true,
};

app.use(cors(corsOptions));

// For POST and PUT requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Router Middleware
app.get('/', (req, res) => {
    res.send('Welcome to the API');

});

// ErrorHandler
app.use(notFound);

app.listen(PORT, () => {
    console.log('Server running on port: %d', PORT);
});

module.exports = {
    app,
};
