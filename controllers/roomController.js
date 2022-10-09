const roomRouter = require('express').Router();
const Room = require('../models/roomModel');
const { convertToSlug, formatedLowerCase } = require('../utils');

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
roomRouter.get('/search', async (request, response, next) => {
    console.log('retrieving a room');
    const { slug } = request.query;
    try {
        const project = await Room.findOne({ slug });
        response.json(project);
    } catch (error) {
        next(error);
    }
});
roomRouter.post('/', async (request, response, next) => {
    console.log('add a new room');
    // const { userId } = request; ESTO PARA CUANDO SE AÑADAN USUARIOS
    //CAMBIAR EL PROJECTID DEL SLUG A userId
    const { projectId, name } = request.body;
    const newRoom = new Room({
        projectId,
        name,
        slug: convertToSlug(`${projectId.slice(-3)}-${name}`),
    });
    try {
        const savedRoom = await newRoom.save();
        response.json(savedRoom);
    } catch (error) {
        next(error);
    }
});



module.exports = roomRouter;