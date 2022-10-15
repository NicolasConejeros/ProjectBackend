/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    avatar: {
        type: String,
    },
    description: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    team: [{
        teamId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        role: {
            type: String,
            required: true,
        }
    }],
}, { timestamps: true });

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

// Exports userSchema as users
module.exports = model('User', userSchema);
