const transcriptionController = require('express').Router();
const Transcription = require('../models/transcriptionModel');
const fs = require('fs');
// const path = require('path');

function addText(pathToFile) {
    console.log(1);
    const contents = fs.readFileSync(pathToFile, 'utf-8');
    console.log(2);
    return contents;

}

transcriptionController.post('/', async (request, response, next) => {
    const audioId = request.body.audioId;
    try {
        const transcription = new Transcription({
            audioId: audioId,
            text: ''
        });
        // console.log(transcription);
        const newTrasncription = await transcription.save();
        response.json(newTrasncription);
    } catch (error) {
        response.json(error);
        next(error);
    }
});

transcriptionController.put('/', async (request, response, next) => {
    const audioId = request.body.audioId;
    const filename = request.body.filename;
    const pathToFile = '..\\transcriptions\\' + filename;
    console.log(pathToFile);
    try {
        const transcription = await Transcription.find({ audioId: audioId });
        console.log(transcription);
        if (!transcription.text) {

            transcription.text = addText(transcription, pathToFile);
        }
        // console.log(transcription);
        const newTrasncription = {
            audioId: transcription.audioId,
            text: transcription.text
        };
        await Transcription.findByIdAndUpdate({ _id: transcription._id }, newTrasncription, { new: true });
        // console.log(JSON.stringify(updatedTranscription,null,2));
        response.json(transcription);
    } catch (error) {
        response.json(error);
        next(error);
    }
});

module.exports = transcriptionController;