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
    console.log('title: ', title);
    console.log('description: ', description);
    console.log('description: ', acceptanceCriteria);
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


module.exports = requirementRouter;