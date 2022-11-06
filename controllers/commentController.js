const commentRouter = require('express').Router();
const Comment = require('../models/commentModel');
const io = require('../socket');

commentRouter.post('/', async (request, response, next) => {
    const { requirementId, user, userName, content, replyTo } = request.body;
    const newComment = new Comment({ requirementId, user, content, replyTo });
    try {
        const savedComment = await newComment.save();
        console.log(requirementId);
        io.getIO().in(requirementId).emit('comments', {
            requirementId: savedComment.requirementId,
            user: savedComment.user,
            userName: userName,
            content: savedComment.content,
            replyTo: savedComment.replyTo,
        });

        response.json(savedComment);
    } catch (error) {
        next(error);
    }
});

commentRouter.delete('/:id', async (request, response, next) => {
    const { id: commentId } = request.params;
    try {
        const comments = await Comment.findByIdAndDelete(commentId);
        console.log(comments);
        response.json(comments);
    } catch (error) {
        next(error);
    }
});

commentRouter.get('/:id', async (request, response, next) => {
    const { id: requirementId } = request.params;
    try {
        const comments = await Comment.find({ requirementId: requirementId }).sort({ updatedAt: 'desc' }).populate({ path: 'user', select: 'name' }).exec();
        console.log(JSON.stringify(comments,null,2));
        response.json(comments);
    } catch (error) {
        next(error);
    }
});


module.exports = commentRouter;