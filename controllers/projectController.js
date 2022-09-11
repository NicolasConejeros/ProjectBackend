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

projectRouter.put('/:id', async (request, response, next) => {
    const { id: projectId } = request.params;
    const { name, description } = request.body;
    try {
        const project = {
            name,
            description
        };
        const updatedProject = await Project.findByIdAndUpdate(projectId, project, { new: true });
        if (updatedProject) {
            response.json(updatedProject);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = projectRouter;