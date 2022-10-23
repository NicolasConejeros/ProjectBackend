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
            const user = await User.findOne({ email: userEmail });
            if (!user) {
                response.status(400).json({ message: 'user not found' });
            } else {
                const team = await Team.findById({ _id: teamId });
                const result = user.teams.find(({ teamId }) => teamId === teamId);
                if (result) {
                    response.status(400).json({ message: 'user already in team' });
                } else {
                    user.teams = user.teams.concat({ teamId: teamId, role: 'member' });
                    user.save();
                    team.members = team.members.concat({
                        user: user.id,
                        role: 'member'
                    });
                    team.save();
                    response.status(200).json({ message: 'user added' }, team);
                }

            }
        } else {
            response.status(401).json({message: 'you do not have the privileges to do this' });
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