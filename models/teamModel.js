/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 40,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
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