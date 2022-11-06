const userRouter = require('express').Router();
const User = require('../models/userModel');
const isAuth = require('../middleware/isAuth');

userRouter.get('/user/me', isAuth, async (request, response, next) => {

    const { userId } = request;
    try {
        const user = await User.findById(userId);
        response.json(user);
    } catch (error) {
        next(error);
    }
});

userRouter.put('/me', isAuth, async (request, response, next) => {

    const { userId } = request;
    const { name, avatar, description, email, password, passwordConfirm } = request.body;

    try {
        const user = await User.findById(userId);
        if(name) user.name= name;
        if(avatar) user.avatar= avatar;
        if(description) user.description= description;
        if(email) user.email= email;
        if(password) user.password= password;
        user.save();
        response.json(user);
    } catch (error) {
        next(error);
    }
});



module.exports = userRouter;