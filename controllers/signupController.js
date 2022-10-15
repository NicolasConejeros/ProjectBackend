const bcrypt = require('bcrypt');
const signupRouter = require('express').Router();
const User = require('../models/userModel');

signupRouter.post('/', async (request, response) => {
    const { name, avatar, description, email, password, passwordConfirm } = request.body;

    if (!(password === passwordConfirm)) {
        response.status(409).send({ error: 'password and confirmation password do not match.' });
    }
    try {
        const userDoc = await User.findOne({ email });
        if (userDoc) {
            response.status(409).send({ error: 'problems with email format' });
        } else {
            const saltRounds = 12;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const user = new User({
                name,
                avatar,
                description,
                email,
                passwordHash,
            });
            const savedUser = await user.save();
            response.status(201).json(savedUser);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = signupRouter;
