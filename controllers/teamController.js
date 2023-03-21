const teamRouter = require('express').Router();
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const isAuth = require('../middleware/isAuth');

teamRouter.put('/', isAuth, async (request, response, next) => {
    console.log('adding a new member');
    // const { userId } = request;
    const { teamId, userEmail, userRole } = request.body;
    console.log(userEmail);
    try {
        if (userRole === 'leader') {
            const user = await User.findOne({ email: userEmail });
            if (!user) {
                response.status(400).json({ message: 'user not found' });
            } else {
                let team = await Team.findById({ _id: teamId });
                const result = user.teams.find(({ teamId }) => teamId == team.id);
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
                    team = await team.populate({ path: 'members.user', select: 'name email id' });
                    response.status(200).json(team);
                }

            }
        } else {
            response.status(401).json({ message: 'you do not have the privileges to do this' });
        }
    } catch (error) {
        next(error);
    }

});
teamRouter.put('/:id', isAuth, async (request, response, next) => {
    console.log('removing a member');
    const { id: projectId } = request.params;
    const { userToRemove: userId } = request.body;

    try {

        let team = await Team.findOne({ project: projectId }).populate({ path: 'members.user', select: 'name email id' });
        let user = await User.findById({ _id: userId });

        team.members = team.members.filter((user) => user.user.id !== userId);
        user.teams = user.teams.filter((userTeam) => !userTeam.teamId.equals(team._id));

        user.markModified('teams');
        await user.save();
        await team.save();
        response.json(team);
    } catch (error) {
        next(error);
    }

});

teamRouter.put('/update/:id', isAuth, async (request, response, next) => {
    console.log('update roles');
    const { id: id } = request.params;
    const { members } = request.body;

    try {
        console.log(JSON.stringify(members, null, 2));

        let team = await Team.findOne({ project: id });

        for (let i = 0; members[i]; i++) {
            team.members[i].role = members[i].role;
        }
        team.markModified('members');
        team.save();
        response.json(members);
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

teamRouter.get('/:id', isAuth, async (request, response, next) => {

    // const { userId } = request;
    const { id: projectId } = request.params;

    try {
        const team = await Team.findOne({ project: projectId }).populate({ path: 'members.user', select: 'name email id' });
        response.json(team);
    } catch (error) {
        next(error);
    }


});



module.exports = teamRouter;