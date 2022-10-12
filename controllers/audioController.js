const audioRouter = require('express').Router();
const Audio = require('../models/audioModel');
const upload = require('../config/multer');
const fs = require('fs');
const { exec } = require('child_process');


audioRouter.get('/:id', async (request, response, next) => {
    const { id: roomId } = request.params;
    try {
        const audio = await Audio.find({ roomId: roomId });
        response.json(audio);
    } catch (error) {
        response.json(error);
        next(error);
    }
});

audioRouter.post('/', upload.upload.single('audio'), async (request, response, next) => {
    try {
        const audio = new Audio({
            roomId: request.body.roomId,
            title: request.body.title,
            artist: request.body.artist,
            music: request.file
        });
        const newAudio = await audio.save();
        console.log(newAudio);
        response.status(200).json({ url: `http://localhost:3080/${newAudio.music.path}` });
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
        });
        console.log(result.music.path);
        response.status(200).json(result);

    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});

audioRouter.put('/', async (request, response, next) => {
    try {
        const id = request.body.id;
        const audio = {
            roomId: request.body.roomId,
            title: request.body.title,
            music: request.file,
            artist: request.body.artist,
            bookmarks: request.body.bookmarks,
            created: request.body.created,
        };
        const updatedAudio = await Audio.findByIdAndUpdate(id, audio, { new: true });
        response.status(200).json(updatedAudio);
    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});

audioRouter.put('/transcribe', async (request, response, next) => {
    
    try {
        const id = request.body.id;
        const audio = await Audio.findById({ _id: id });
        let newName = audio.music.filename.substring(0, audio.music.filename.lastIndexOf('.')) || audio.music.filename;
        const newPath = 'uploads\\' + newName + '.wav';
        if (audio.music.mimetype != 'audio/wav') {
            exec(`ffmpeg -i "${audio.music.path}" -ac 1 ${newPath}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message} `);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr} `);
                    return;
                }
                console.log(`stdout: ${stdout} `);
            });
        }
        newName = 'transcriptions\\' + newName;
        exec(`python "python\\example\\test_simple.py" ${newPath} ${newName}.txt`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message} `);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr} `);
                return;
            }
            console.log(`stdout: ${stdout} `);
        });
        
        response.status(200).json(audio);
    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});


module.exports = audioRouter;