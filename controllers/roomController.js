const roomRouter = require('express').Router();
const Room = require('../models/roomModel');

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
roomRouter.get('/:id', async (request, response, next) => {
    console.log('retrieving a room');
    const { id: roomId } = request.params;
    try {
        const project = await Room.findById(roomId);
        response.json(project);
    } catch (error) {
        next(error);
    }
});
roomRouter.post('/', async (request, response, next) => {
    console.log('add a new room');
    const { projectId, name } = request.body;
    const newRoom = new Room({
        projectId,
        name
    });
    try {
        const savedRoom = await newRoom.save();
        response.json(savedRoom);
    } catch (error) {
        next(error);
    }
});



module.exports = roomRouter;