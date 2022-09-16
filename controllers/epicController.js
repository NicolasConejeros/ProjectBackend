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


module.exports = epicRouter;