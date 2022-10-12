/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { Schema, model } = require('mongoose');

const transcriptionSchema = new Schema({
    audioId: {
        type: Schema.Types.ObjectId,
        ref: 'Audio'
    },
    text: {
        type: String,
    },
});
transcriptionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
// Exports roomSchema as room
module.exports = model('Transcription', transcriptionSchema);
