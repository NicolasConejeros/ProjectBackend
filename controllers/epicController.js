const epicRouter = require('express').Router();
const Epic = require('../models/epicModel');

epicRouter.post('/', async (request, response, next) => {
    const { projectId, title } = request.body;
    const newEpic = new Epic({ projectId, title });
    try {
        const savedEpic = await newEpic.save();
        response.json(savedEpic);
    } catch (error) {
        next(error);
    }
});

epicRouter.get('/:id', async (request, response, next) => {
    const { id: epicId } = request.params;
    try {
        const epic = await Epic.findById(epicId);
        response.json(epic);
    } catch (error) {
        next(error);
    }
});

epicRouter.get('/project/:id', async (request, response, next) => {
    const { id: projectId } = request.params;
    try {
        const epic = await Epic.find({ projectId: projectId }).exec();
        console.log(epic);
        response.json(epic);
    } catch (error) {
        next(error);
    }
});


module.exports = epicRouter;