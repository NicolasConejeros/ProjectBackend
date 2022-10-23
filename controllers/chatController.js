const chatRouter = require('express').Router();
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const isAuth = require('../middleware/isAuth');
const io = require('../socket');

chatRouter.get('/:id', isAuth, async (request, response, next) => {

    const { id: chatId } = request.params;

    try {
        const chat = await Chat.findById(chatId).populate({ path: 'chatters messages' }).exec();
        response.json(chat);
    } catch (error) {
        next(error);
    }
});

chatRouter.post('/', isAuth, async (request, response, next) => {

    const { userId } = request;
    const { text, chat } = request.body;

    console.log('text: ' + text + ' chat: ' + chat);

    try {
        const newMessage = new Message({
            text,
            chat,
            user: userId
        });
        const savedMessage = await newMessage.save();

        const chatRoom = await Chat.findById({_id: chat});
        chatRoom.messages = chatRoom.messages.concat(savedMessage._id);
        await chatRoom.save();
        console.log(savedMessage);
        io.getIO().emit(chat, savedMessage);
        response.json(savedMessage);
    } catch (error) {
        next(error);
    }
});


module.exports = chatRouter;