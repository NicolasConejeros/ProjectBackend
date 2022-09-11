const projectRouter = require('express').Router();
const Project = require('../models/projectModel');

projectRouter.get('/', async (request, response, next) => {
    console.log('get all projects');
    try {
        const populatedProject = await Project.find({}).populate('requirements');
        response.json(populatedProject);
    } catch (error) {
        next(error);
    }
});

projectRouter.post('/', async (request, response, next) => {
    const { name, description } = request.body;
    console.log('name: ', name);
    console.log('description: ', description);
    try {
        const newProject = new Project({
            name,
            description
        });
        const savedProject = await newProject.save();
        return response.json(savedProject);
    } catch (error) {
        next(error);
    }
});

module.exports = projectRouter;