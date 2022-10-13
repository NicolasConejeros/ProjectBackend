const transcriptionController = require('express').Router();
const Transcription = require('../models/transcriptionModel');
const fs = require('fs');
const path = require('path');

async function addText(pathToFile) {

    const contents = fs.readFileSync(path.join(__dirname, pathToFile), 'utf8');
    return contents;
}

transcriptionController.post('/', async (request, response, next) => {
    const audioId = request.body.audioId;

    try {
        const transcription = new Transcription({
            audioId: audioId,
            text: ''
        });

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

    try {
        const transcription = await Transcription.find({ audioId: audioId });
        //checks if the file is already added to the touple
        if (!transcription[0].text) {
            //if not, it will be added
            const newTrasncription = {
                audioId: transcription[0].audioId,
                text: await addText(pathToFile)
            };
            await Transcription.findByIdAndUpdate({ _id: transcription[0].id }, newTrasncription, { new: true });
            //the file will be deleted to save space
            fs.unlink(path.join(__dirname, pathToFile), (err) => {
                if (err) {
                    console.error(err);
                }
            });
            response.json(newTrasncription);
        } else {
            response.json(transcription[0]);
        }
    } catch (error) {
        response.json(error);
        next(error);
    }
});

module.exports = transcriptionController;