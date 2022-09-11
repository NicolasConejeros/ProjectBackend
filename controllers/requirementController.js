const requirementRouter = require('express').Router();
const Requirement = require('../models/requirementModel');
const Project = require('../models/projectModel');

requirementRouter.get('/', async (request, response, next) => {
    console.log('get all requirements');
    try {
        const requirements = await Requirement.find({});
        response.json(requirements);
    } catch (error) {
        next(error);
    }
});

requirementRouter.post('/', async (request, response, next) => {
    const { title, description, acceptanceCriteria, projectId } = request.body;
    const project = await Project.findById(projectId);
    const newRequirement = new Requirement({
        title,
        description,
        acceptanceCriteria,
        projectId
    });
    try {

        const savedRequirement = await newRequirement.save();
        project.requirements = project.requirements.concat(savedRequirement);
        await project.save();
        return response.json(savedRequirement);
    } catch (error) {
        next(error);
    }
});

requirementRouter.put('/:id', async (request, response, next) => {
    const { id: requirementId } = request.params;
    const { title, description, acceptanceCriteria } = request.body;
    try {
        const requirement = {
            title,
            description,
            acceptanceCriteria
        };
        const updatedRequirement = await Requirement.findByIdAndUpdate(requirementId, requirement, { new: true });
        if (updatedRequirement) {
            response.json(updatedRequirement);
        }
    } catch (error) {
        next(error);
    }
});


module.exports = requirementRouter;