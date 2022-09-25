const commentRouter = require('express').Router();
const Comment = require('../models/commentModel');

commentRouter.post('/', async (request, response, next) => {
    const { requirementId, user, content, replyTo } = request.body;
    const newComment = new Comment({ requirementId, user, content, replyTo });
    try {
        const savedComment = await newComment.save();
        response.json(savedComment);
    } catch (error) {
        next(error);
    }
});

// commentRouter.get('/:id', async (request, response, next) => {
//     const { id: epicId } = request.params;
//     console.log('get epic');
//     try {
//         const epic = await Epic.findById(epicId);
//         response.json(epic);
//     } catch (error) {
//         next(error);
//     }
// });

commentRouter.get('/:id', async (request, response, next) => {
    const { id: requirementId } = request.params;
    console.log('get all comments of a requirement');
    try {
        const comments = await Comment.find({ requirementId: requirementId }).sort({ updatedAt: 'desc' }).exec();
        console.log(comments);
        response.json(comments);
    } catch (error) {
        next(error);
    }
});


module.exports = commentRouter;