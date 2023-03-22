const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginRoute = require('express').Router();
const User = require('../models/userModel');

const { SECRET_TOKEN } = process.env;

loginRoute.post('/', async (request, response) => {
    const { email, password } = request.body;
    console.log('entra a login');
    const user = await User.findOne({ email });
    console.log(user);
    let passwordCorrect = false;
    try {
        passwordCorrect = user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);
    } catch (error) {
        passwordCorrect = false;
    }

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Invalid email or password',
        });
    }

    const userForToken = {
        id: user._id,
        email: user.email,
    };

    console.log('uft:' + userForToken.id);
    const token = jwt.sign(
        userForToken,
        SECRET_TOKEN,
        {
            expiresIn: 60 * 60 * 24 * 7,
        },
    );
    console.log(token);
    response.setHeader('Authorization', `Bearer ${token}`);
    return response.send({
        token,
    });
});
loginRoute.delete('/', async (request, response) => {
    if (request.session) {
        request.session.destroy(error => {
            if (error) {
                response.status(400).send('Unable to log out');
            } else {
                response.send('Logout successful');
            }
        });
    } else {
        response.end();
    }
});


module.exports = loginRoute;
