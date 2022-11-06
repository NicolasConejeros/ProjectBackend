/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'room',
        required: true
    },
    chatters: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }],

}, { timestamps: true });

chatSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports chatSchema as room
module.exports = model('Chat', chatSchema);