/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    requirementId: {
        type: Schema.Types.ObjectId,
        ref: 'Requirement',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    content:{
        type: String,
        required: true,
        maxLength: 255,
    },
    replyTo:{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
}, { timestamps: true });

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports commentSchema as users
module.exports = model('Comment', commentSchema);