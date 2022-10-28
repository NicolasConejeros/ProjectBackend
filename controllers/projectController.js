const projectRouter = require('express').Router();
const Project = require('../models/projectModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const isAuth = require('../middleware/isAuth');

projectRouter.get('/', isAuth,async (request, response, next) => {

    const { userId } = request;

    try {
        const project = await Team.find({ 'members.user': userId }).limit(3).sort({ createdAt: 'desc' }).select({ 'project': 1, '_id': 0 }).populate('project');
        response.json(project);
    } catch (error) {
        next(error);
    }
});

projectRouter.get('/myprojects', isAuth, async (request, response, next) => {

    // const { userId } = request;
    try {
        const projects = await Team.find({}).sort({ updatedAt: 'desc' });    
        response.json(projects);
    } catch (error) {
        next(error);
    }
});

projectRouter.get('/:id', async (request, response, next) => {

    const { id: projectId } = request.params;

    try {
        const project = await Project.findById(projectId).populate('team');
        response.json(project);
    } catch (error) {
        next(error);
    }
});

projectRouter.post('/', async (request, response, next) => {

    const { name, description, userId } = request.body;

    try {
        const newTeam = new Team({
            name: 'Sin nombre',
            members: [{
                user: userId,
                role: 'leader',
            }]
        });

        const newProject = new Project({
            name,
            description,
            team: newTeam.id
        });
        newTeam.project = newProject.id;

        const savedTeam = await newTeam.save();

        const user = await User.findById(userId);
        user.teams = user.teams.concat({ teamId: savedTeam.id, role: 'leader' });

        user.save();
        const savedProject = await newProject.save();

        response.json(savedProject);
        
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