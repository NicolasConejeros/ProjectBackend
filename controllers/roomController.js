const roomRouter = require('express').Router();
const Room = require('../models/roomModel');
const Chat = require('../models/chatModel');
const isAuth = require('../middleware/isAuth');
const { convertToSlug } = require('../utils');

roomRouter.get('/project/:id', isAuth, async (request, response, next) => {

    const { id: projectId } = request.params;

    try {
        const project = await Room.find({ projectId });
        response.json(project);
    } catch (error) {
        next(error);
    }
});
roomRouter.get('/search', isAuth, async (request, response, next) => {

    const { userId } = request;
    const { slug } = request.query;

    try {
        const room = await Room.findOne({ slug }).populate({ path: 'teamId', select: 'members' }).exec();
        room.teamId.members.find(({ user }) => user == userId) ?
            response.json(room) :
            response.status(401).json({ message: 'unauthorized' });
    } catch (error) {
        next(error);
    }
});
roomRouter.post('/', isAuth, async (request, response, next) => {

    const { userId } = request;
    const { projectId, name, teamId } = request.body;


    const newRoom = new Room({
        projectId,
        name,
        slug: convertToSlug(`${userId.slice(-3)}-${name}`),
        teamId: teamId.id
    });
    try {
        const newchat = new Chat({
            room: newRoom.id,
            chatters: teamId.members
        });
        newchat.save();
        newRoom.chatId = newchat.id;
        const savedRoom = await newRoom.save();
        response.json(savedRoom);
    } catch (error) {
        next(error);
    }
});



module.exports = roomRouter;