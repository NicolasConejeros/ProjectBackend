const teamRouter = require('express').Router();
const Team = require('../models/teamModel');

// teamRouter.get('/project/:id', async (request, response, next) => {
//     console.log('get the rooms of a project');
//     const { id: projectId } = request.params;
//     try {
//         const project = await Team.find({ projectId });
//         response.json(project);
//     } catch (error) {
//         next(error);
//     }
// });
// teamRouter.get('/search', async (request, response, next) => {
//     console.log('retrieving a room');
//     const { slug } = request.query;
//     try {
//         const project = await Team.findOne({ slug });
//         response.json(project);
//     } catch (error) {
//         next(error);
//     }
// });
teamRouter.post('/', async (request, response, next) => {
    console.log('add a new team');
    // const { userId } = request; ESTO PARA CUANDO SE AÑADAN USUARIOS
    //CAMBIAR EL PROJECTID DEL SLUG A userId
    const { userId, role } = request.body;
    const newTeam = new Team({
        members: [{
            userId,
            role,
        }]
    });
    try {
        const savedTeam = await newTeam.save();
        response.json(savedTeam);
    } catch (error) {
        next(error);
    }
});



module.exports = teamRouter;