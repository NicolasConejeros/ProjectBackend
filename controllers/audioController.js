const audioRouter = require('express').Router();
const Audio = require('../models/audioModel');
const Transcription = require('../models/transcriptionModel');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const io = require('../socket');


audioRouter.get('/:id', async (request, response, next) => {
    const { id: roomId } = request.params;
    try {
        const audio = await Audio.find({ roomId: roomId }).populate({ path: 'transcription' });
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
        response.status(200).json({ url: `http://localhost:3080/${newAudio.music.path}` });

    } catch (error) {
        response.status(500).json({ error });
        next(error);
    }
});

audioRouter.delete('/:id', async (request, response, next) => {
    console.log('entra a borrar');


    try {
        const { id: id } = request.params;

        console.log('deleting the audio: ' + id);
        const result = await Audio.findByIdAndDelete(id);
        await Transcription.deleteMany({ audioId: id });
        //delete the audio file
        fs.unlink(result.music.path, (err) => {
            if (err) {
                console.error(err);
            }
        });

        response.status(200).json(result);

    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});

audioRouter.put('/', async (request, response, next) => {

    try {
        const id = request.body.id;
        const index = request.body.index;
        const audioSocket = request.body.audioSocket;
        const audio = {
            roomId: request.body.roomId,
            title: request.body.title,
            music: request.file,
            artist: request.body.artist,
            bookmarks: request.body.bookmarks,
            created: request.body.created,
        };

        const updatedAudio = await Audio.findByIdAndUpdate(id, audio, { new: true });
        io.getIO().in(audioSocket).emit('room', updatedAudio.bookmarks, index);

        response.status(200).json(updatedAudio);

    } catch (error) {
        response.status(500).json(error);
        next(error);
    }
});

function audioToWav(audio, newPath) {

    execSync(`ffmpeg -i "/app/${audio.music.path}" -ac 1 ${newPath}`, (error, stdout, stderr) => {
        if (error) {
            // console.log(`error: ${error.message} `);
            return;
        }
        if (stderr) {
            // console.log(`stderr: ${stderr} `);
            return;
        }
        // console.log(`stdout: ${stdout} `);
    });
}

function deleteOldAudio(oldPath, newPath) {


    const itExists = fs.existsSync(newPath);
    if (itExists) {
        fs.unlink(path.join(__dirname, '..\\' + oldPath), (err) => {
            if (err) {
                console.error(err);
            }
        });

    }



    return true;
}



function addText(pathToFile, audioId) {

    const contents = fs.readFileSync(path.join(__dirname, pathToFile), 'utf8');
    const newTrasncription = new Transcription({
        audioId: audioId,
        text: contents
    });
    //the file will be deleted to save space
    fs.unlink(path.join(__dirname, pathToFile), (err) => {
        if (err) {
            console.error(err);
        }
    });
    newTrasncription.save();

    return newTrasncription;
}

audioRouter.put('/transcribe', async (request, response, next) => {

    const id = request.body.id;
    const audio = await Audio.findById({ _id: id });

    //gets the filename without the extension
    let newName = audio.music.filename.substring(0, audio.music.filename.lastIndexOf('.')) || audio.music.filename;
    let textPath = newName;
    //newPath to save the converted audio in case we need it
    const newPath = 'uploads/' + newName + '.wav';

    try {
        if (fs.existsSync(path.join(__dirname, '../transcriptions/' + newName + '.txt'))) {
            response.status(200).json({ si: 'ta listo' });
        } else {
            //if the audio is not a wav file(required to transcribe) it will be converted 
            if (audio.music.mimetype != 'audio/wav') {

                //converting the audio
                audioToWav(audio, newPath);

                //deleting old file
                deleteOldAudio(audio.music.path, newPath);

                //changing the audio params to match the file
                audio.music.path = newPath;
                audio.music.filename = newName + '.wav';
                audio.music.mimetype = 'audio/wav';
                //in case mongo doesnt detect the changes, we mark it manually
                audio.markModified('music');
            }


            //new path to write the transcription
            newName = 'transcriptions/' + newName;

            //transcribes the audio
            exec(`python3 "python/example/transcription.py" ${newPath} ${newName}.txt`, function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                //path to the txt file
                const pathToFile = '../transcriptions/' + textPath + '.txt';

                //it adds the txt to the db, and returns the id of the element that contains it
                const transcription = addText(pathToFile, id);

                //update the audio params to add the transcription
                audio.transcription = transcription.id;

                //in case mongo doesnt detect the changes, we mark it manually
                audio.markModified('transcription');

                //saves the changes made to the audio element
                audio.save();

                response.status(200).json(transcription);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        }

    } catch (error) {

        next(error);
    }
});


module.exports = audioRouter;