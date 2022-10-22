const teamRouter = require('express').Router();
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const isAuth = require('../middleware/isAuth');

teamRouter.put('/', isAuth, async (request, response, next) => {
    console.log('adding a new member');
    // const { userId } = request;
    const { teamId, userEmail, userRole } = request.body;
    try {
        if (userRole === 'leader') {
            const user = User.find({ email: userEmail });
            if (!user) {
                response.json({ status: 'error', message: 'user not found' });
            } else {
                const team = Team.findById({ id: teamId });
                team.members.concat({
                    user: user.id,
                    role: 'member'
                });
                team.save();
                response.json({ status: 'success', message: 'user added' },team);
            }
        }
    } catch (error) {
        next(error);
    }

});

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