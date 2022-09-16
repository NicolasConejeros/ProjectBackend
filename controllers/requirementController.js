const requirementRouter = require('express').Router();
const Requirement = require('../models/requirementModel');

// requirementRouter.get('/', async (request, response, next) => {
//     console.log('get all requirements');
//     try {
//         const requirements = await Requirement.find({});
//         response.json(requirements);
//     } catch (error) {
//         next(error);
//     }
// });

requirementRouter.get('/:id', async (request, response, next) => {
    const { id: projectId } = request.params;
    console.log('get all requirements of a project');
    try {
        const requirements = await Requirement.find({ projectId: projectId }).populate('epicId').exec();
        response.json(requirements);
    } catch (error) {
        next(error);
    }
});

requirementRouter.post('/', async (request, response, next) => {
    const { title, description, acceptanceCriteria, projectId, epicId } = request.body;
    if (epicId) {
        const newRequirement = new Requirement({
            projectId,
            epicId,
            title,
            description,
            acceptanceCriteria,
        });
        try {
            const savedRequirement = await newRequirement.save();
            response.json(savedRequirement);
        } catch (error) {
            next(error);
        }
    }
    else {
        const newRequirement = new Requirement({
            projectId,
            title,
            description,
            acceptanceCriteria,
        });
        try {
            const savedRequirement = await newRequirement.save();
            response.json(savedRequirement);
        } catch (error) {
            next(error);
        }
    }


});

requirementRouter.put('/:id', async (request, response, next) => {
    const { id: requirementId } = request.params;
    const { title, description, acceptanceCriteria, epicId} = request.body;
    try {
        const requirement = {
            epicId,
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