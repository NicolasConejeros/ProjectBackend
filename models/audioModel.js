/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const audioSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    music: {
        type: Object,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now(),
    }
});
// Exports roomSchema as room
module.exports = model('Audio', audioSchema);
