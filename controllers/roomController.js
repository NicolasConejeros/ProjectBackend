const roomRouter = require('express').Router();
const Room = require('../models/roomModel');
const Chat = require('../models/chatModel');
const isAuth = require('../middleware/isAuth');
const { convertToSlug } = require('../utils');

roomRouter.get('/project/:id', async (request, response, next) => {
    console.log('get the rooms of a project');
    const { id: projectId } = request.params;
    try {
        const project = await Room.find({ projectId });
        response.json(project);
    } catch (error) {
        next(error);
    }
});
roomRouter.get('/search', isAuth, async (request, response, next) => {
    console.log('retrieving a room');
    const { userId } = request;
    const { slug } = request.query;
    try {
        const room = await Room.findOne({ slug }).populate('teamId');
        console.log(5);
        console.log(room);
        console.log(6);
        // room.teamId.members.user.find(user => user.id === userId) ? 
            response.json(room);
            // response.json({ status: 'error', message: 'user not found' });
    } catch (error) {
        next(error);
    }
});
roomRouter.post('/', isAuth, async (request, response, next) => {
    console.log('add a new room');
    const { userId } = request;
    // const { userId } = request; ESTO PARA CUANDO SE AÑADAN USUARIOS
    //CAMBIAR EL PROJECTID DEL SLUG A userId
    const { projectId, name, teamId } = request.body;
    const newRoom = new Room({
        projectId,
        name,
        slug: convertToSlug(`${userId.slice(-3)}-${name}`),
        teamId: [teamId]
    });
    try {
        const newchat = new Chat({
            room: newRoom.id,
            chatters: [{
                user: userId,
            }]
        });
        newchat.save();
        const savedRoom = await newRoom.save();
        response.json(savedRoom);
    } catch (error) {
        next(error);
    }
});



module.exports = roomRouter;