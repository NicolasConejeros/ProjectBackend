/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const teamSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            required: true,
        }
    }],

}, { timestamps: true });

teamSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports teamSchema as room
module.exports = model('Team', teamSchema);