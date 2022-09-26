/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    projectId:{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
}, { timestamps: true });

roomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports roomSchema as room
module.exports = model('Room', roomSchema);