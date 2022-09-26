/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const audioSchema = new Schema({
    roomId:{
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
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
audioSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
// Exports roomSchema as room
module.exports = model('Audio', audioSchema);
