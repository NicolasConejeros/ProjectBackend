/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const requirementSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    acceptanceCriteria: {
        type: String,
    },
}, { timestamps: true });

requirementSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports requirementSchema as users
module.exports = model('Requirement', requirementSchema);