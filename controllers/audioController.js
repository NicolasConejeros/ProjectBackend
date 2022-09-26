const audioRouter = require('express').Router();
const Audio = require('../models/audioModel');
const upload = require('../config/multer');
const fs = require('fs');


audioRouter.get('/', async (request, response, next) => {
    try {
        const audio = await Audio.find();
        response.status(200).json(audio);
    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});

audioRouter.post('/', upload.upload.single('audio'), async (request, response, next) => {
    try {
        const audio = new Audio({
            title: request.body.title,
            artist: request.body.artist,
            music: request.file
        });
        let newAudio = await audio.save();
        response.status(200).json({ data: newAudio });
    } catch (error) {
        response.status(500).json({ error });
        next(error);
    }
});

audioRouter.delete('/:id', async (request, response, next) => {
    try {
        const { id: id } = request.params;


        const result = await Audio.findByIdAndDelete(id);
        fs.unlink(result.music.path, (err) => {
            if (err) {
                console.error(err);
            }

            //file removed
        });
        console.log(result.music.path);
        response.status(200).json(result);
    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});

module.exports = audioRouter;