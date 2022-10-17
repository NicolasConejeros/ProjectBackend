const userRouter = require('express').Router();
const User = require('../models/userModel');
const isAuth = require('../middleware/isAuth');

userRouter.get('/user/me', isAuth, async (request, response, next) => {
    console.log('get a user');
    const { userId } = request;
    console.log(userId);
    try {
        const user = await User.findById(userId);
        response.json(user);
    } catch (error) {
        next(error);
    }
});



module.exports = userRouter;