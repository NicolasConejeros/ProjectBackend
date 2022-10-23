const chatRouter = require('express').Router();
const Chat = require('../models/chatModel');
const isAuth = require('../middleware/isAuth');

chatRouter.get('/:id', isAuth, async (request, response, next) => {

    const { id: chatId } = request.params;

    try {
        
        const chat = await Chat.findById(chatId).populate({ path: 'chatters messages'}).exec();
        response.json(chat);
    } catch (error) {
        next(error);
    }
});


module.exports = chatRouter;