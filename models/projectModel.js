/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 40,
    },
    description: {
        type: String,
        maxLength: 150,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
    },
}, { timestamps: true });

projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports projectSchema as users
module.exports = model('Project', projectSchema);