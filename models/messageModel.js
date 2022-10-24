/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

messageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Message = model('Message', messageSchema);

module.exports = Message;
