/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const requirementSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    epicId: {
        type: Schema.Types.ObjectId,
        ref: 'Epic',
    },
    title: {
        type: String,
        maxLength: 40,
    },
    description: {
        type: String,
        maxLength: 255,
    },
    acceptanceCriteria: {
        type: String,
        maxLength: 255,
    },
    timestamp: {
        audioId: {
            type: Schema.Types.ObjectId,
            ref: 'Audio',
        },
        timestamp: {
            type: Number,
            default: null
        }
    }
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