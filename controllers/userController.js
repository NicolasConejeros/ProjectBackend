const userRouter = require('express').Router();
const User = require('../models/userModel');

userRouter.get('/:id', async (request, response, next) => {
    console.log('get a user');
    const { id: userId } = request.params;
    try {
        const user = await User.findById({ _id: userId });
        response.json(user);
    } catch (error) {
        next(error);
    }
});
userRouter.post('/', async (request, response, next) => {
    console.log('register a new user');
    // const { userId } = request; ESTO PARA CUANDO SE AÑADAN USUARIOS
    //CAMBIAR EL PROJECTID DEL SLUG A userId
    const { name, avatar, description, email, passwordHash } = request.body;
    const newUser = new User({
        name,
        avatar,
        description,
        email,
        passwordHash,
    });
    try {
        const savedUser = await newUser.save();
        response.json(savedUser);
    } catch (error) {
        next(error);
    }
});



module.exports = userRouter;